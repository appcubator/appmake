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
    };
    return fn;

}

function parseGenID(generatorName) {
}

function replace(parent, key, genData) {
    var genID = parseGenID(obj.generator);
    var generatedObj = constructGen(findGenData(genID))(genData.data);
    parent[key] = generatedObj;
}

exports.expandAll = function(app) {
   _.each(routes, function(route, i) {
       if ('generator' in obj) {
           replace(routes, i, obj);
       }
   });

    // TODO
    // app.models
    // app.templates
    return app;
};
