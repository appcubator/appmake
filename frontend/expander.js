/* See bottom of file for module usage.
 * This code is browserified and shared between frontend and backend.
 */

var _ = require("underscore"),
    builtinGenerators = require("../generators/generators");

exports.factory = function(_safe_eval_) {

    var expander = {};

    function findGenDataSub(generators, genID) {
        // generators is some object of generators to search through
        // genID is an obj w (package, module, name, version) keys
        // Search order: generators, plugins, then builtinGenerators

        var packageObj = generators[genID.package];
        if (packageObj === undefined) {
            throw { name: 'GenNotFound', message: "Package " + genID.package + " not found", level: 'package' };
        }

        var module = packageObj[genID.module];
        if (module === undefined)
            throw { name: 'GenNotFound', message: "Module " + genID.module + " not found in package " + genID.package, level: 'module' };

        // linear search through the generators in the module.
        var generator;
        for (var i = 0; i < module.length; i ++){
            var generator2 = module[i];
            if ((generator2.name == genID.name) && (generator2.version == genID.version)) {
                generator = generator2;
                break;
            }
        }

        if (generator === undefined)
            throw { name: 'GenNotFound', message: "Generator '"+genID.name+"' with version '"+genID.version+"' not found in module '"+genID.module+"'", level: 'generator' };

        return generator;
    }

    function findGenData(plugins, generators, genID) {
        // plugins is app.plugins
        // generators is app.generators
        var generator;
        var searchList = [generators, plugins, builtinGenerators];
        while (searchList.length !== 0) {
            var genCollection = searchList.shift();
            var found;

            try {
                found = true;
                generator = findGenDataSub(genCollection, genID);
            } catch (e) {
                if (e.name === 'GenNotFound') {
                    found = false;
                } else {
                    throw e;
                }
            }

            if (found) {
                generator._pristine = (genCollection !== generators);
                return generator;
            }
        }

        throw {name: 'GenNotFound', message: "Generator '"+genID.name+"' with version '"+genID.version+"' not found." };
    }

    expander.findGenData = findGenData;

    function constructGen(generatorData) {
        // input the generator's data from the json
        // output a function which can directly be used for generator execution.
        var fn = function(plugins, generators, data) {
            var templates = generatorData.templates;
            var compiledTemplates = {};

            _.each(templates, function(templateStr, index) {
                compiledTemplates[index] = _.template(templateStr);
            });

            if(generatorData.defaults) {
                data = _.defaults(data, generatorData.defaults);
            }

            // TODO compile each EJS template so that it can have a render method.
            var expandFn = function(data) { return expand(plugins, generators, data); };
            var globals = {
                data: data,
                templates: compiledTemplates,
                expand: expandFn,
                _: _,
                console: console // debug
            };
            var code = '(' + generatorData.code + ')(data, templates);';
            
            var genObj = "ERROR";

            try {
                genObj = _safe_eval_(code, globals);
            }
            catch(e) {
                console.log(e);
                throw generatorData.name;
            }

            return genObj;
        };
        return fn;
    }

    function parseGenID(generatorName) {
        var tokens = generatorName.split('.');
        var module, package, name, version;
        // TODO care about version nums. for now everything is 0.1.

        version = "0.1";

        if (tokens.length == 2) {
            package = 'root';
            module = tokens[0];
            name = tokens[1];
        } else if (tokens.length == 3) {
            package = tokens[0];
            module = tokens[1];
            name = tokens[2];
        } else {
            throw "Invalid generator reference syntax. Must provide '[package.]module.name' .  Original: " + generatorName;
        }


        return { package: package, module: module, name: name, version: version };
    }

    expander.parseGenID = parseGenID;

    function expandOnce(plugins, generators, genData) {
        try {
            var genID = parseGenID(genData.generate);
            var generatedObj = constructGen(findGenData(plugins, generators, genID))(plugins, generators, genData.data);
            return generatedObj;
        }
        catch(e) {
            _.each(genID, function(val, key) {
                console.log(val + " " + key);
            });
            throw JSON.stringify(genID, null, 3) + " : " + e;
        }
    }

    expander.expandOnce = expandOnce;

    function expand(plugins, generators, genData) {
        // TODO check for cycles
        while (typeof(genData) == typeof({}) && 'generate' in genData) {
            genData = expandOnce(plugins, generators, genData);
        }
        return genData;
    }

    expander.expand = expand;

    expander.expandAll = function(app) {
        app.plugins = app.plugins || []; // TEMP BECAUSE THIS DOES NOT YET EXIST.
        try {
            _.each(app.routes, function(route, i) {
                app.routes[i] = expand(app.plugins, app.generators, route);
            });

            _.each(app.models, function(model, index) {
                app.models[index] = expand(app.plugins, app.generators, model);
            });

            _.each(app.templates, function (template, index) {
                app.templates[index] = expand(app.plugins, app.generators, template);
            });

            app.templates.push({name: "header", code: app.header||""});
            app.templates.push({name: "scripts", code: app.scripts||""});

            app.config = expand(app.plugins, app.generators, app.config);
            app.css = expand(app.plugins, app.generators, app.css);
        }
        catch(e) {
            console.log("ERROR with generator: " + e);
            throw e;
        }
        return app;
    };


    return expander;

};

try {
    var x = window;
    // No error -> we're in the frontend
    window.expanderfactory = exports.factory;
} catch (e) {
    // e is a ReferenceError, which implies we're in the backend
    exports.init = function() {
        // avoid browserifying vm
        var r = require;
        return exports.factory(r('vm').runInNewContext);
    };
}
