var vm = require("vm"),
    ejs = require("ejs"),
    _ = require("underscore"),
    builtinGenerators = require("../generators/generators");

function findGenData(generators, genID) {
    // generators is app.generators
    // genID is an obj w (package, module, name, version) keys
    // Search order: generators, then builtinGenerators

    var packageObj = generators[genID.package];
    if (packageObj === undefined) {
        packageObj = builtinGenerators[genID.package];
        if (packageObj === undefined) {
            throw "Package " + genID.package + " not found";
        }
    }
    var module = packageObj[genID.module];
    if (module === undefined)
        throw "Module " + genID.module + " not found in package " + genID.package;

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
        throw "Generator '"+genID.name+"' with version '"+genID.version+"' not found in module '"+genID.module+"'";

    return generator;
}

function constructGen(generatorData) {
    // input the generator's data from the json
    // output a function which can directly be used for generator execution.
    var fn = function(generators, data) {
        var templates = generatorData.templates;
        var compiledTemplates = {};
        _.each(templates, function(templateStr, templateName) {
            compiledTemplates[templateName] = ejs.compile(templateStr);
        });
        // TODO compile each EJS template so that it can have a render method.
        var expandFn = function(data) { return expand(generators, data); };
        var globals = {
            data: data,
            templates: compiledTemplates,
            expand: expandFn,
            //console: console // debug
        };
        var code = '(' + generatorData.code + ')(data, templates);';
        var genObj = vm.runInNewContext(code, globals);
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
        throw "Invalid dot separation. Must be 2 or 3 tokens. Original: " + generatorName;
    }


    return { package: package, module: module, name: name, version: version };
}

function expandOnce(generators, genData) {
    var genID = parseGenID(genData.generate);
    var generatedObj = constructGen(findGenData(generators, genID))(generators, genData.data);
    return generatedObj;
}

function expand(generators, genData) {
    // TODO check for cycles
    while (typeof(genData) == typeof({}) && 'generate' in genData) {
        genData = expandOnce(generators, genData);
    }
    return genData;
}

exports.expand = expand;

exports.expandAll = function(app) {
    _.each(app.routes, function(route, i) {
        app.routes[i] = expand(app.generators, route);
    });

    _.each(app.models, function(model, index) {
        app.models[index] = expand(app.generators, model);
    });

    _.each(app.templates, function (template, templateName) {
        app.templates[templateName] = expand(app.generators, template);
    });

    app.config = expand(app.generators, app.config);
    return app;
};
