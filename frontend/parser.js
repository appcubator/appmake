var fs = require("fs"),
    path = require("path"),
    _ = require("underscore");

function loadDir(dirPath) {
    // load contents of directory into a path-content mapping
    // two types of content:
        // string = file content
        // if obj, it recursively refers to the contents of a subdirectory

}

// pass the type, value to be the type, and locString which is just some string to help with debugging location of the error.
function assertType(typeString, value, locString) {
    var valueType = typeof(value);
    if (valueType != typeString)
        throw { errcode: 'TypeError', message: 'Found: "' + valueType '", expected "'+typeString+'" ('+value+' in '+locString+')' };
}

function parseModel(modelName, content) {
    // potentially insecure: the content code could require fs module and wreak havoc.
    // do not run untrusted code on server without proper jailing.
    var model = eval("'use strict'; " + content + "; {fields:fields, instancemethods:instancemethods, staticmethods:staticmethods}")
    // TODO validate that content exposes the right variables

    // validate schema of model
    for (var fieldName in model.fields) {
        assert('string', fieldName, 'model.'+modelName+'.fields');
    }
    for (var im in model.instancemethods) {
        assertType('function', im, 'model.'+modelName+'.instancemethods');
        model.instancemethods[im] = im.toString(); // convert the function to its source code for serialization
    }
    for (var is in model.staticmethods) {
        assertType('function', is, 'model.'+modelName+'.staticmethods');
        model.staticmethods[is] = is.toString(); // convert the function to its source code for serialization
    }
    return model;
}

function parseTemplate(templateName, content) {
    // TODO parse HTML/XML syntax that I have yet to decide.
    // return the list of uielements (this is assuming rowcol strategy)
}

function parseRoutes(content) {
    // TODO eval and grab the routes variable.
    // typecheck and convert functions to strings.
}

function parseGenerator(generatorName, content) {
}

exports.parseDir = function (dirPath) {

    var dirContents = loadDir(dirPath);
    // var app = { packages:{}, modules:{}, models:{}, templates:{}, routes:[], generators:{}};
    var app = {};

    app.packages = JSON.parse(dirContents.packages);
    app.modules = dirContents.modules; // TODO change the spec to be this nested object, it better represents a tree.

    app.models = {};
    for (var modelName in dirContents.models) {
        if (!modelName.endsWith('.js'))
            continue; // TODO maybe print a warning?

        // take off the '.js' ending to get model name
        modelName = modelName.substr(0, modelName.length - 3);
        // TODO validate modelName

        app.models[modelName] = parseModel(modelName, dirContents.models[modelName]);
    }

    app.templates = {};
    for (var templateName in dirContents.templates) {
        if (!templateName.endsWith('.ejs'))
            continue; // TODO maybe print a warning?

        // take off the '.ejs' ending to get template name
        templateName = templateName.substr(0, templateName.length - 4);
        // TODO validate templateName

        app.templates[templateName] = parseTemplate(templateName, dirContents.templates[templateName]);
    }

    app.routes = parseRoutes(dirContents['routes.js']);

    app.generators = {};
    for (var generatorName in dirContents.generators) {
        if (!generatorName.endsWith('.js'))
            continue; // TODO maybe print a warning?

        // take off the '.ejs' ending to get generator name
        generatorName = generatorName.substr(0, generatorName.length - 3);
        // TODO validate generatorName

        app.generators[generatorName] = parseGenerator(generatorName, dirContents.generators[generatorName]);
    }

    // TODO figure out this CSS thing

    return app;
};
