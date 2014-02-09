var modelslib = require("./modelslib.js").code.toString(),
    expander = require('./expander').init(require('vm').runInNewContext),
    _ = require('underscore'),
    less = require('less');

/* fix the function wrapping hack */
var lines = modelslib.split('\n');
var relevantLines = lines.slice(1, lines.length-1);
modelslib = relevantLines.join('\n');

exports.doPostExpandMagic = function(app, callback) {
    // Note: use callback since less css-generation is async

    // autogenerate api routes and modelDefs template for the frontend library
    var modelDefs = {};
    _.each(app.models, function(model) {
        var thisModelDef = { functions: {} };
        // Note that modelDefs will be mutated iff the below code runs in at least one iteration
        _.each(model.functions, function(sm) {
            //if (sm.enableAPI) {
            if (false) {
                modelDefs[model.name] = thisModelDef; // this need only happens once but repeatedly doesn't hurt and code is easier this way.
                modelDefs[model.name].functions[sm.name] = ''; // TODO custom url can go here.
                app.routes.push(expander.expand(app.generators, {
                    generate: "routes.apiroute",
                    data: { modelName: model.name,
                            methodName: sm.name } // TODO custom url can go here as well.
                }));
            }
        });
    });
    app.templates.push({ name: 'modeldefs', code: 'var modelDefs = ' + JSON.stringify(modelDefs, null, 2) + ';' });

    app.modules = app.modules || {};
    app.modules.static = app.modules.static || {};
    app.modules.static['models.js'] = modelslib;
    app.modules.Procfile = 'web: node devmon.js $PORT 3000 $PWD node app.js 3000';
    app.modules['.appcubator'] = '(this file tells the hosting system to use the Appcubator buildpack)';
    less.render(app.css || '', function(e, css){
        if (e) console.log(e);
        if (e) throw e;
        app.modules.static['style.css'] = css;
        callback(app);
    });

    return app;
};
