var vm = require("vm"),
    ejs = require("ejs"),
    _ = require("underscore");

function findGenData(generators, genID) {
    // generators is app.generators
    // genID is an obj w (module, name, version) keys
    var module = generators[genID.module];
    if (module === undefined)
        throw "Generator module not found";
    var generator;
    // linear search through the generators in the module.
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
    var fn = function(data) {
        var templates = generatorData.templates;
        var compiledTemplates = {};
        _.each(templates, function(templateStr, templateName) {
            compiledTemplates[templateName] = ejs.compile(templateStr);
        });
        // TODO compile each EJS template so that it can have a render method.
        var globals = {
            data: data,
            templates: compiledTemplates
        };
        var code = '(' + generatorData.code + ')(data, templates);';
        var genObj = vm.runInNewContext(code, globals);
        return genObj;
    };
    return fn;
}

function parseGenID(generatorName) {
    var tokens = generatorName.split('.');

    var genName = tokens[tokens.length-1];

    var moduleString = tokens.slice(0,tokens.length-1).join('.') ;

    // TODO version nums. for now everything is 0.1.
    return { module: moduleString, name: genName, version: '0.1' };
}

function expand(generators, genData) {
    var genID = parseGenID(genData.generate);
    var generatedObj = constructGen(findGenData(generators, genID))(genData.data);
    return generatedObj;
}

exports.expandAll = function(app) {
    _.each(app.routes, function(route, i) {
        if ('generate' in route) {
            app.routes[i] = expand(app.generators, route);
        }
    });

    _.each(app.models, function(model, modelName) {
        _.each(model.instanceMethods, function(im, imName) {
            if ('generate' in im) {
                app.models.instanceMethods[imName] = expand(app.generators, im);
            }
        });
        _.each(model.staticMethods, function(sm, smName) {
            if ('generate' in sm) {
                app.models.staticMethods[smName] = expand(app.generators, sm);
            }
        });
    });

    // app.templates
    return app;
};
