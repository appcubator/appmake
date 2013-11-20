var mustache = require('mustache');

// packages.json
exports.packages = function(packages) { return "this is packages.json" };

// the js code for a mongoose model
exports.modeljs = function(model) { return "// schema, staticmethods, instancemethods" };

// the client js file
exports.js = function(models) { return "alert('helloworld');" };

// the css file
exports.css = function(css) { return "body { background-color: red }" };

// page template
exports.template = function(template) { return "<p>This is a sample template for a page</p>" };

// page rendering logic
exports.routes = function(routes) { return "// repeat: http url, method, functions" };

// js code for http server and registers routes
exports.app = function() { return "// this is app.js main code (binds routes)" };
