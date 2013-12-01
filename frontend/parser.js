var fs = require("fs"),
    path = require("path"),
    _ = require("underscore"),
    vm = require("vm");

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

// pass the type, value to be the type, and locString which is just some string to help with debugging location of the error.
function assertType(typeString, value, locString) {
    var valueType = typeof(value);
    var errorMsg = 'Found: "' + valueType + '", expected "' + typeString + '" (' + value + ' in ' + locString + ')';
    if (valueType != typeString)
        throw errorMsg;
}
// if value undefined, throws error to define the value called varName.
function assertExists(value, varName) {
    var valueType = typeof(value);
    var errorMsg = 'Please expose variable \'' + varName + '\'';
    if (valueType == typeof('undefined'))
        throw errorMsg;
}

function parseModel(modelName, content) {
    // potentially insecure: safely running untrusted code requires a separate process.
    var model = vm.runInNewContext(content + "; var __noconflictplz__ = {fields:fields, instancemethods:instancemethods, staticmethods:staticmethods}; __noconflictplz__");

    assertExists(model.fields, 'fields');
    assertExists(model.instancemethods, 'instancemethods');
    assertExists(model.staticmethods, 'staticmethods');

    // validate schema of model
    for (var fieldName in model.fields) {
        assertType('string', fieldName, 'model.'+modelName+'.fields');
    }
    for (var imName in model.instancemethods) {
        assertType('string', imName, 'model.'+modelName+'.instancemethods');
        var im = model.instancemethods[imName];
        assertType('function', im, 'model.'+modelName+'.instancemethods');
        model.instancemethods[imName] = im.toString(); // convert the function to its source code for serialization
    }
    for (var isName in model.staticmethods) {
        assertType('string', isName, 'model.'+modelName+'.staticmethods');
        var is = model.staticmethods[isName];
        assertType('function', is, 'model.'+modelName+'.staticmethods');
        model.staticmethods[isName] = is.toString(); // convert the function to its source code for serialization
    }
    return model;
}

function parseTemplate(templateName, content) {
    // TODO parse HTML/XML syntax that I have yet to decide.
    // return the list of uielements (this is assuming rowcol strategy)

    // Parsing algorithm:
    // find <uie>
    // find </uie>
    // take a slice, push, and search again.
    // then parse all uielements strings into objects.
    var subContent = content;
    var openIndex = content.indexOf('<uie>'),
        closeIndex,
        uieStrings = [];
    while (openIndex != -1) {
        closeIndex = subContent.indexOf('</uie>');
        if (closeIndex == -1) {
            // TODO throw unmatched <uie> tag
        }
        var uieSlice = subContent.slice(openIndex + 5, closeIndex);
        uieStrings.push(uieSlice);
        subContent = subContent.slice(closeIndex + 6);
        openIndex = subContent.indexOf('<uie>');
    }

    function parseUIEString(uieString) {
        // for now, there is a html, css, and js section. TODO layout?
        var openHTML = uieString.indexOf('<html>'),
            closeHTML = uieString.indexOf('</html>'),
            openJS = uieString.indexOf('<js>'),
            closeJS = uieString.indexOf('</js>'),
            openCSS = uieString.indexOf('<css>'),
            closeCSS = uieString.indexOf('</css>');
        var html = uieString.slice(openHTML + 6, closeHTML),
            js = uieString.slice(openJS + 4, closeJS),
            css = uieString.slice(openCSS + 5, closeCSS);
        return {html:html, js:js, css:css};
    }

    var uielements = _.map(uieStrings, parseUIEString);
    return uielements;

}

function parseRoutes(content) {
    // potentially insecure: safely running untrusted code requires a separate process.
    var routes = vm.runInNewContext("'use strict'; " + content + "; routes");

    assertExists(routes, 'routes');

    _.each(routes, function(route, index) {
        assertType('string', route.method, 'routes.'+index+'.method');
        assertType('string', route.pattern, 'routes.'+index+'.pattern');
        assertType('function', route.code, 'routes.'+index+'.code');
        route.code = route.code.toString();
    });

    return routes;
}

function parseGenerator(generatorName, content) {
}

exports.parseDir = function (dirPath) {

    var dirContents = loadDir(dirPath);
    var app = {};

    app.packages = JSON.parse(dirContents['requires.json']);
    app.modules = dirContents.modules; // TODO change the spec to be this nested object, it better represents a tree.

    app.models = {};
    for (var modelName in dirContents.models) {
        // if not modelName.endsWith(.js)
        if (modelName.indexOf('.js') !== (modelName.length -  3)) {
            console.log("[parser] Skipping non-js file: " + modelName);
            continue;
        }

        // take off the '.js' ending to get model name
        modelName = modelName.substr(0, modelName.length - 3);
        // TODO validate modelName

        app.models[modelName] = parseModel(modelName, dirContents.models[modelName + '.js']);
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

        app.templates[templateName] = parseTemplate(templateName, dirContents.templates[templateName + '.ejs']);
    }

    app.routes = parseRoutes(dirContents['routes.js']);

    /* TODO Will implement generators after it works without it.
    app.generators = {};
    for (var generatorName in dirContents.generators) {
        if (!generatorName.endsWith('.js'))
            continue; // TODO maybe print a warning?

        // take off the '.ejs' ending to get generator name
        generatorName = generatorName.substr(0, generatorName.length - 3);
        // TODO validate generatorName

        app.generators[generatorName] = parseGenerator(generatorName, dirContents.generators[generatorName]);
    } */

    // TODO figure out this CSS thing

    return app;
};
