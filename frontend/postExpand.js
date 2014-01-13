var modelslib = require("./modelslib.js").code.toString(),
    expander = require('./expander').init(require('vm').runInNewContext),
    _ = require('underscore');

/* fix the function wrapping hack */
var lines = modelslib.split('\n');
var relevantLines = lines.slice(1, lines.length-1);
modelslib = relevantLines.join('\n');

exports.doPostExpandMagic = function(app) {
    // autogenerate api routes and modelDefs template for the frontend library
    var modelDefs = {};
    _.each(app.models, function(model) {
        var thisModelDef = { instancemethods: {}, staticmethods: {} };
        // Note that modelDefs will be mutated iff the below code runs in at least one iteration
        _.each(model.staticmethods, function(sm) {
            if (sm.enableAPI) {
                modelDefs[model.name] = thisModelDef; // this need only happens once but repeatedly doesn't hurt and code is easier this way.
                modelDefs[model.name].staticmethods[sm.name] = ''; // TODO custom url can go here.
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

    return app;
};
