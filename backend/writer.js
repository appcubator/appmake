var path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    templates = require("./templates");

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

    // package.json
    _writeFile(_j(dirpath, 'package.json'), templates.packages(app.packages));

    // custom modules
    for (var filepath in app.modules) {
        validatefp(filepath);
        _writeFile(_j(dirpath, filepath), app.modules[filepath]);
    }

    // models
    for (var modelName in app.models) {
        var model = app.models[modelName];
        model.name = modelName;
        validatefname(modelName + '.js');
        _writeFile(_j(dirpath, 'models', modelName + '.js'), templates.modeljs(model));
    }

    // templates
    for (var templateName in app.templates) {
        var template = app.templates[templateName];
        template.name = templateName;
        validatefname(templateName + '.ejs');
        _writeFile(_j(dirpath, 'views', templateName + '.ejs'), templates.template(template, template.layoutStrategy));
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


exports.write = write;
