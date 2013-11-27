/* Takes the final app data representation and renders it out to templates. */
var ejs = require('ejs'),
    path = require('path'),
    fs = require('fs');


/* Code in templates */


function fromFile(filepath) {
    return fs.readFileSync(path.join(__dirname, filepath), 'utf-8');
}

var templates = {
    model : ejs.compile(fromFile('/templates/model.js'))
  , routes : ejs.compile(fromFile('/templates/routes.js'))
};


// mongoose model js code
exports.modeljs = function(model) { return templates.model({ model: model}); };

// page template
exports.template = function(template, layoutStrategy) {
    // based on the layout strategy, do something.
    var templateLines = [];
    if (layoutStrategy == 'rowcol') {
        for (var i = 0; i < template.uielements.length; i ++) {
            // TODO rowcol layout. the following is temporary.
            var uie = template.uielements[i];
            templateLines.push(uie.html);
            templateLines.push("<style>"+uie.css+"</style>");
            templateLines.push("<script>"+uie.js+"</script>");
        }
    } else {
        templateLines.push("<p>Layout strategy &quot;"+layoutStrategy+"&quot; is not yet implemented</p>");
    }

    return templateLines.join("\n");
};

// routes (ie to render page)
exports.routes = function(routes) { return templates.routes({routes: routes}); };



/* Boilerplate */


var appjs = fs.readFileSync(path.join(__dirname, 'templates/app.js'));

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

// js code for http server and registers routes
exports.app = function() { return appjs; };
