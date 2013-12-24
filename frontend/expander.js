var vm = require("vm"),
    ejs = require("ejs"),
    _ = require("underscore"),
    rootGenerators = require("../generators/generators");

function findGenData(generators, genID) {
    // generators is app.generators
    // genID is an obj w (module, name, version) keys
    var packageNameSeperatorIndex = genID.module.indexOf(".");
    var packageName,
        moduleName,
        packageObj;

    // TODO: validate package name validateGenID(genID);
    if (packageNameSeperatorIndex === -1) {
        packageName = "root";
        moduleName = genID.module;
        packageObj = rootGenerators;
    } else {
        packageName = genID.module.substr(0, packageNameSeperatorIndex);
        moduleName = genID.module.substr(packageNameSeperatorIndex + 1, genID.module.length);
        packageObj = generators[packageName];
    }
    if (packageObj === undefined)
        throw "Package " + packageName + " not found";
    var module = packageObj[moduleName];
    if (module === undefined)
        throw "Module " + moduleName + " not found in package " + packageName;

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

function expandOnce(generators, genData) {
    var genID = parseGenID(genData.generate);
    var generatedObj = constructGen(findGenData(generators, genID))(genData.data);
    return generatedObj;
}

function expand(generators, genData) {
    // TODO check for cycles
    while ('generate' in genData) {
        genData = expandOnce(generators, genData);
    }
    return genData
}

exports.expandAll = function(app) {
    _.each(app.routes, function(route, i) {
        app.routes[i] = expand(app.generators, route);
    });

    _.each(app.models, function(model, modelName) {
        _.each(model.instanceMethods, function(im, imName) {
            app.models.instanceMethods[imName] = expand(app.generators, im);
        });
        _.each(model.staticMethods, function(sm, smName) {
            app.models.staticMethods[smName] = expand(app.generators, sm);
        });
    });

    _.each(app.templates, function (uielements, templateName) {

        // TODO make this a code generator, since each structure is specific to the layout strategy.
        // Copied over from parser.js
        var concat = function (uielements) {
            var templateLines = [];
            for (var i = 0; i < uielements.length; i ++) {
                var uie = uielements[i];
                templateLines.push(uie.html);
                templateLines.push("<style>"+uie.css+"</style>");
                templateLines.push('<script type="text/javascript">'+uie.js+'</script>');
            }
            return templateLines.join("\n");
        };

        var expandedUIElements = _.map(uielements, function(uie){ return expand(app.generators, uie); });
        app.templates[templateName] = concat(expandedUIElements);
    });
    return app;
};
