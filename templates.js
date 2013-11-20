/* Takes the final app data representation and renders it out to templates. */
var ejs = require('ejs'),
    path = require('path'),
    fs = require('fs');

templates = {
    routes : ejs.compile({url: '/templates/routes.js.template'})
  , appjs : fs.readFileSync(path.join(__dirname, 'templates/app.js'))
};

// packages.json
exports.packages = function(packages) { return JSON.stringify(packages, null, 4); };

// the js code for a mongoose model
exports.modeljs = function(model) { return "// schema, staticmethods, instancemethods" };

// the client js file
exports.js = function(models) { return "alert('helloworld');" };

// the css file
exports.css = function(css) { return "body { background-color: red }" };

// page template
exports.template = function(template) { return "<p>This is a sample template for a page</p>" };

// page rendering logic
exports.routes = function(routes) { return templates.routes(routes); };

// js code for http server and registers routes
exports.app = function() { return templates.appjs };
