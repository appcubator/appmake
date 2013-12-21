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

        for (var i = 0; i < uielements.length; i++){
            while ('generate' in uielements[i]){ // Keep expanding till 
                uielements[i] =  expand(app.generators, uielements[i]);
            }
        }
        app.templates[templateName] = concat(uielements);
    })
    return app;
};
