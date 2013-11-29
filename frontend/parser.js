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
exports.parseDir = function (dirPath) {

    var dirContents = loadDir(dirPath);
    var app = { packages:{}, modules:{}, models:{}, templates:{}, routes:[], generators:{}};

    for (var modelName in dirContents.models) {
        if (!modelName.endsWith('.js'))
            continue; // TODO maybe print a warning?

        // take off the '.js' ending to get model name
        modelName = modelName.substr(0, modelName.length - 3);

        // TODO validate modelName, validate that content exposes the right variables
        app.models[modelName] = parseModel(modelName, app.models[modelName]);
    }


    return app;
};
