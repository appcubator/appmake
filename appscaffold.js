/* App Scaffold
 *
 * A highly structured representation of a web application.
 *
 * It's just code embedded in a fancy json structure. It compiles to code.
 *
 * The base abstraction is the module. You can write and ship your own modules.
 * You can also import npm packages which include modules of their own.
 *
 * The code execution entry points are the routes.
 *
 * Routes may render templates, and the presence of "exposed" model methods
 * implies the auto-creation of routes.
 *
 * Rendered templates include <script> tags including stub objects
 * to make remote method calls with model methods. Somehow we'll use "context"
 * to get the right stub and call the method of the right object.
 *
 *
 * Notice that from this App Scaffold, generating the full application is not hard.
 */


var packages = {};     // npm modules go here (package.json format)
                       // assume express.js 3.4.4 ships with it by default.

var modules = {};      // custom code modules go here (commonjs or requirejs)
                       // ie, say you wanted to write your own data scraper.

var models = {};       // models' schema, instance methods, static methods.
                       // some model methods exposed via http, see uielements js.

// purely presentation. for, if, render. pluggable layout strategies.
var templates = [{
    name: "Homepage",
    layoutStrategy: "rowcol",
    uielements: [{html:"<h1 class=\"testing\">{{content}}</h1>",
                  css:".testing {color: red}",
                  js:"alert('just testing');"}],
                  // client will be able to call model methods transparently.
                  // we'll generate client stubs and server api.
}];
var css = {};          // structured css data which compiles to css.

// used for pages, and leaves room for custom route functions.
var routes = [{
    url: "/", // route to match
    logic: "return render(req, template, { content: 'Hello world!'});",
    // in the logic section, you can do access control, DB queries or search, API calls, etc.
}];

var app = {
    packages: packages,
    modules: modules,
    models: models,
    templates: templates,
    css: css,
    routes: routes
};



/* Macro expansion
 *
 * These are the base abstractions. On top of this, there will be a macro system
 * so that a computer can auto-generate parts of this data.
 * "Macro" is just a fancy word for some code which will transform data into other data.
 *
 * UIElement Macros: Given some inputs, generate html template, css, and js code.
 * Model Macros: Given some model and fields, generate methods.
 * Route Macros: Given some template and auth rules, generate route.
 *
 */


// Philosophical points:

// Start with macros, switch to writing your own code as you desire more flexibility.
//
// There is never a need to edit the underlying generated code,
//   since the mapping from App Scaffold to code is so direct.
//
// The purpose of the App Scaffold is to help the user decide where to put code,
//   and to help the computer understand the organization of the code.
//
// The macro system will leverage the nice target structure to reliably generate correct code.


