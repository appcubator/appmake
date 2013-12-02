var vm = require("vm");

function findGenData(generators, genID) {
    // generators is app.generators
    // genID is an obj w (module, name, version) keys
    var module = generators[genID.module];
    if (module === undefined)
        throw "Generator module not found";
    var genpack = genID[name];
    if (genpack === undefined)
        throw "Generator not found";
    var generator = genpack[genID.version];
    if (generator === undefined)
        throw "Version not found";

    return generator;
}

function constructGen(generatorData) {
    // input the generator's data from the json
    // output a function which can directly be used for generator execution.
    var fn = function(data) {
        var templates = generatorData.templates;
        // TODO compile each EJS template so that it can have a render method.
        var templatesFn = function(){};
        var genObj = vm.runInNewContext('var data = ' + JSON.stringify(data)+'; ' +
                                  'var EJS = require(\'ejs\'); ' +
                                  'var templates = ' + JSON.stringify(templates) + '; ' +
                                  generatorData.code + '(data, templates);');
        return genObj;
    };
    return fn;
}

function parseGenID(generatorName) {
    var tokens = generatorName.split('.');

    var genName = tokens[tokens.length-1];

    tokens.remove(tokens.length-1);
    var moduleString = tokens.join('.') ;

    // TODO version nums. for now everything is 0.1.
    return { module: moduleString, name: genName, version: '0.1' };
}

function replace(parent, key, genData) {
    var genID = parseGenID(obj.generator);
    var generatedObj = constructGen(findGenData(genID))(genData.data);
    parent[key] = generatedObj;
}

exports.expandAll = function(app) {
    _.each(routes, function(route, i) {
        if ('generator' in route) {
            replace(routes, i, route);
        }
    });

    _.each(models, function(model, modelName) {
        _.each(model.instanceMethods, function(im, imName) {
            if ('generator' in im) {
                replace(models.instanceMethods, imName, im);
            }
        });
        _.each(model.staticMethods, function(sm, smName) {
            if ('generator' in sm) {
                replace(models.staticMethods, smName, sm);
            }
        });
    });

    // app.templates
    return app;
};
