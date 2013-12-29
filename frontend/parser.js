var fs = require("fs"),
    path = require("path"),
    _ = require("underscore"),
    vm = require("vm"),
    validator = require("./validator");

function loadDir(dirPath) {
    // load contents of directory into a path-content mapping
    // two types of content:
        // string = file content
        // if obj, it recursively refers to the contents of a subdirectory

    var contents = {};

    _.each(fs.readdirSync(dirPath), function(filename){
        if (filename.charAt(0) === '.')
            // skip hidden files
            return;
        var filepath = path.join(dirPath, filename);
        var fileStat = fs.statSync(filepath);
        if (fileStat.isFile()) {
            contents[filename] = fs.readFileSync(filepath).toString();
        } else if (fileStat.isDirectory()) {
            contents[filename] = loadDir(filepath);
        }
    });
    return contents;
}

function parseModel(modelName, content) {
    // potentially insecure: safely running untrusted code requires a separate process.
    var model = vm.runInNewContext(content + "; model");

    validator.validateGenrefOr (validator.validateModel) (model, 'models.' + modelName);
    return model;
}

function parseTemplate(templateName, content) {
    var template = vm.runInNewContext("'use strict'; " + content + "; template");
    validator.assertExists(template, 'template');
    return template;
}

function parseRoutes(content) {
    // Note that routes may contain generators, and that's OK.
    var routes = vm.runInNewContext("'use strict'; " + content + "; routes");

    validator.assertExists(routes, 'routes');

    _.each(routes, function(route, index) {
        var locString = 'routes.'+index;
        validator.validateGenrefOr (validator.validateRoute) (route, locString);
    });

    return routes;
}

function parseGenerator(generatorName, content) {
    var generators = vm.runInNewContext("'use strict'; " + content + "; generators");
    validator.assertExists(generators, 'generators');
    _.each(generators, function(generator, index) {
        var locString = 'generators.'+index;
        validator.validateGenerator(generator, locString);
    });
    return generators;
}

exports.parseDir = function (dirPath) {

    var dirContents = loadDir(dirPath);
    var app = {};

    app.packages = JSON.parse(dirContents['requires.json']);
    app.modules = dirContents.modules; // TODO change the spec to be this nested object, it better represents a tree.

    app.models = [];
    for (var modelName in dirContents.models) {
        // if not modelName.endsWith(.js)
        if (modelName.indexOf('.js') !== (modelName.length -  3)) {
            console.log("[parser] Skipping non-js file: " + modelName);
            continue;
        }

        // take off the '.js' ending to get model name
        modelName = modelName.substr(0, modelName.length - 3);
        // TODO validate modelName

        var modelObj = parseModel(modelName, dirContents.models[modelName + '.js']);
        app.models.push(modelObj);
    }

    app.templates = {};

    for (var templateName in dirContents.templates) {
        //if (!templateName.endsWith('.ejs'))
        if (templateName.indexOf('.ejs') !== (templateName.length  - 4)) {
            console.log("[parser] Skipping non-ejs file: " + templateName);
            continue; // TODO maybe print a warning?
        }

        // take off the '.ejs' ending to get template name
        templateName = templateName.substr(0, templateName.length - 4);
        // TODO validate templateName

        var uielements = parseTemplate(templateName, dirContents.templates[templateName + '.ejs']);
        app.templates[templateName] = uielements;

    }

    app.routes = parseRoutes(dirContents['routes.js']);

    app.generators = {};
    for (var generatorName in dirContents.generators) {
        // Assume the name of the package is its folder name
        app.generators[generatorName] = {};
        if (typeof(dirContents.generators[generatorName]) !== typeof({})) {
            // case file
            console.log("Warning: root generators should go in appmake. I'm ignoring whatever this is!: " + generatorName);
        } else {
            // case directory
            for (var moduleFileName in dirContents.generators[generatorName]) {
                // Assume moduleFileName ends with .js and module structure is only 1 level deep
                var moduleName = moduleFileName.substr(0, moduleFileName.length - 3);
                app.generators[generatorName][moduleName] = parseGenerator(moduleName, dirContents.generators[generatorName][moduleFileName]);
            }
        }

    }

    function parseConfig(content) {
        var config = vm.runInNewContext(content + "; config");
        validator.assertExists(config, 'config');
        return config;
    }
    app.config = parseConfig(dirContents['config.js']);

    // TODO figure out this CSS thing
    return app;
};
