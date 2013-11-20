#!/usr/bin/env node
var temp = require("temp"),
    path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    templates = require("./templates");


// uncomment this to remove the tempfiles after writing:
// temp.track();

var _j = path.join;

function validatefp(filepath) {
    // validate valid file names to prevent file-level hacks.
    // don't overwrite packages, node_modules, models.js etc etc.
}

function validatefname(fname) {
    // validate valid file name
}

/* Write the app to the dirpath (pass the path) */
function write(app, dirpath, callback) {

    var filesWritten = 0;
    var filesToWrite = 0;
    var doneDispatching = false;
    var _writeFile = function(filepath, content, lastcall) {
        filesToWrite ++;
        if (lastcall) doneDispatching = true;
        mkdirp.mkdirp(path.dirname(filepath), function(err) {
            if (err) throw err;
            fs.writeFile(filepath, content, function(err2) {
                if (err2) throw err2;
                if (doneDispatching && ((filesWritten + 1) == filesToWrite)) {
                    callback();
                }
                filesWritten ++;
            });
        });
    };

    // packages.json
    _writeFile(_j(dirpath, 'packages.json'), templates.packages(app.packages));

    // custom modules
    for (var filepath in app.modules) {
        validatefp(filepath);
        _writeFile(_j(dirpath, filepath), app.modules[filepath]);
    }

    // models
    for (var i = 0; i < app.models.length; i++) {
        var model = app.models[i];
        validatefname(model.name + '.js');
        _writeFile(_j(dirpath, 'models', model.name + '.js'), templates.modeljs(model));
    }

    // templates
    for (var i = 0; i < app.templates.length; i++) {
        var template = app.templates[i];
        validatefname(template.name + '.ejs');
        _writeFile(_j(dirpath, 'templates', template.name + '.ejs'), templates.template(template));
    }

    // css
    _writeFile(_j(dirpath, 'static', 'style.css'), templates.css(app.css));

    // js (with rmi of models)
    _writeFile(_j(dirpath, 'static', 'script.js'), templates.js(app.models));

    // routes
    _writeFile(_j(dirpath, 'routes.js'), templates.routes(app.routes));

    // app
    _writeFile(_j(dirpath, 'app.js'), templates.app(), true);

}

function writeTemp(app, cb) {
    temp.mkdir('appmake', function(err, dirpath) {
        write(app, dirpath, function(){ return cb(dirpath); });
    });
}

if (require.main === module) {
    process.stdin.resume();

    var jsonStrings = [];

    process.stdin.on('data', function(chunk) {
        jsonStrings.push(chunk);
    });

    process.stdin.on('end', function() {
        var app = JSON.parse(jsonStrings.join(''));
        writeTemp(app, function(x) { return process.stdout.write(x) });
    });
}
