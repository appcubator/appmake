/* Takes the final app data representation and renders it out to templates. */
var ejs = require('ejs'),
    path = require('path'),
    fs = require('fs');


/* Code in templates */


function fromFile(filepath) {
    return fs.readFileSync(path.join(__dirname, filepath), 'utf-8');
}

var templates = {
    routes : ejs.compile(fromFile('/templates/routes.js'))
};


// routes (ie to render page)
exports.routes = function(routes) { return templates.routes({routes: routes}); };



/* Boilerplate */


// packages.json
exports.packages = function(packages) {
    // packages is a flat object of string - string.
    var data = { dependencies: packages };
    return JSON.stringify(data, null, 4);
};

// the client js file
exports.js = function(models) { return "alert('helloworld');" };

// the css file
exports.css = function(css) { return "body { background-color: red }" };
