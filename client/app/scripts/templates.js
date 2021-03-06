define(function(){

this["JST"] = this["JST"] || {};

this["JST"]["app/scripts/templates/App.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="container">\n  <div class=\'row\' style="position:relative; margin-top: 60px;">\n    <div class=\'col-md-3\'>\n    <img style="width:280px; margin-top: 10px;" id=\'coolImage\' src=\'http://bit.ly/1eWmdak\'> </img>\n    </div>\n    <div class=\'col-md-6\'>\n      <div class=\'brand\' style="margin-left: 20px; line-height: 94px;">Appcubator <small style="margin-left: 90px;"> CUBE </small> </div>\n    </div>\n  </div>\n  <hr>\n  <p class="lead" >Welcome to the Appcubator Plugin repository. Explore, discover and contribute to Appcubator! To get started search for a plugin or open the <a href="#" class="startPluginEditorButton"> plugin editor. </a></p>\n</div>\n\n<div class="container">\n  <div class="row">\n\n    <div class="col-md-8">\n        <input id=\'repoSearchInput\' class="form-control input-lg " type="text" placeholder="Search by description..."> \n        </input>\n    </div>\n\n    <div class="col-md-1">\n        <h3 class=\'lead\'> or <h3>\n    </div>  \n\n    <div class="col-md-3">\n        <span>\n            <button class=\'btn btn-lg btn-default startPluginEditorButton\'> Plugin Editor </button> \n        </span>\n    </div>\n     \n  </div>\n</div>\n';

}
return __p
};

this["JST"]["app/scripts/templates/Gen.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<a href="#generators/' +
((__t = (packageName)) == null ? '' : __t) +
'/' +
((__t = (moduleName)) == null ? '' : __t) +
'/' +
((__t = (name)) == null ? '' : __t) +
'" class="list-group-item">\n\t<p class="lead list-group-item-heading"><b> ' +
((__t = (name)) == null ? '' : __t) +
' </b></p>\n\t<p class="list-group-item-heading"><i>' +
((__t = (packageName)) == null ? '' : __t) +
'</i>.' +
((__t = (moduleName)) == null ? '' : __t) +
'.' +
((__t = (name)) == null ? '' : __t) +
' <i>by</i> ' +
((__t = (author)) == null ? '' : __t) +
'</p>\n</a>\n';

}
return __p
};

this["JST"]["app/scripts/templates/Generator.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<div class="container">\n    <h1> ' +
((__t = ( name )) == null ? '' : __t) +
' <small> <a> ' +
((__t = (packageName)) == null ? '' : __t) +
'</a>.<a>' +
((__t = (moduleName)) == null ? '' : __t) +
'</a>.' +
((__t = (name)) == null ? '' : __t) +
'</small> </h1>\n    <h3> <span class=\'lead\'> version </span> ' +
((__t = (version)) == null ? '' : __t) +
' <span class=\'lead\'> by </span> ' +
((__t = (author)) == null ? '' : __t) +
' </h3>\n    <p class="lead" >' +
((__t = (description)) == null ? '' : __t) +
'.</p>\n\n    ';
 for (prop in templates) { ;
__p += '\n      <h3> ' +
((__t = (prop)) == null ? '' : __t) +
' </h3>\n      <pre>' +
((__t = (templates[prop])) == null ? '' : __t) +
'</pre> \n    ';
 } ;
__p += '\n</div>\n\n    ';

}
return __p
};

this["JST"]["app/scripts/templates/Home.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += ' <div class="container">\n        <h1>Appcubator Generators</h1>\n        <p class="lead" >Welcome to the Appcubator Generator repository. Explore, discover and contribute to Appcubator! To get started, run <code>npm install -g appcubator-gen</code> </p>\n      </div>\n\n    <div class="container">\n      <!-- Example row of columns -->\n      <div class="row">\n        <div class="col-md-8">\n            <form id="pluging-search-form">\n              <input id=\'repoSearchInput\' class="form-control input-lg " type="text" placeholder="Search by description...">\n            </form>\n        </div>\n        <div class="col-md-1">\n            <h3 class=\'lead\'> or <h3>\n        </div>     \n        <div class="col-md-3">\n            <span>\n                 <input type="submit" class=\'btn btn-lg btn-default\' id="search-button" value="View All Generators">\n            </span>\n        </div>\n        \n        <div class="col-md-12">\n          <ul class="search-list" id="search-list">\n          </ul>\n        </div>\n      </div><!-- endrow -->';

}
return __p
};

this["JST"]["app/scripts/templates/LoaderView.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<p>Your content here.</p>\n\n';

}
return __p
};

this["JST"]["app/scripts/templates/PluginEditor.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- Context menu -->\n <div id="contextMenu" class="dropdown clearfix">\n    <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style="display:block;position:static;margin-bottom:5px;">\n      <li><a tabindex="-1" href="#">Action</a></li>\n      <li><a tabindex="-1" href="#">Another action</a></li>\n      <li><a tabindex="-1" href="#">Something else here</a></li>\n      <li class="divider"></li>\n      <li><a tabindex="-1" href="#">Separated link</a></li>\n    </ul>\n  </div>\n<!-- end -->\n\n\n<!-- Load file modal -->\n<div class="modal fade" id="loadModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n        <h4 class="modal-title" id="myModalLabel"> Load Resources </h4>\n\n      </div>\n      <div class="modal-body">\n        <h1 class=\'lead\'> To get started, log in to your Appcubator account and select an app. Alternatively, you can add, edit and build on existing plugins in the repository. </h1>\n\n\t\t<form class="form-horizontal" role="form">\n\t\t  <div class="form-group">\n\t\t    <label for="inputEmail3" class="col-sm-2 control-label">Email</label>\n\t\t    <div class="col-sm-10">\n\t\t      <input disabled type="email" class="form-control" id="inputEmail3" placeholder="Email">\n\t\t    </div>\n\t\t  </div>\n\t\t  <div class="form-group">\n\t\t    <label for="inputPassword3" class="col-sm-2 control-label">Password</label>\n\t\t    <div class="col-sm-10">\n\t\t      <input disabled type="password" class="form-control" id="inputPassword3" placeholder="Password">\n\t\t    </div>\n\t\t  </div>\n\t\t  <div class="form-group">\n\t\t    <div class="col-sm-offset-2 col-sm-10">\n\t\t      <div class="checkbox">\n\t\t        <label>\n\t\t          <input disabled type="checkbox"> Remember me\n\t\t        </label>\n\t\t      </div>\n\t\t    </div>\n\t\t  </div>\n\t\t  <div class="form-group">\n\t\t    <div class="col-sm-offset-2 col-sm-10">\n\t\t      <button disabled type="submit" class="btn btn-default">Sign in</button>\n\t\t    </div>\n\t\t  </div>\n\t\t</form>\n\n\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- Download Modal  -->\n\n\n<!-- Load file modal -->\n<div class="modal fade" id="downloadModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n        <h4 class="modal-title" id="myModalLabel"> Load Resources </h4>\n      </div>\n      <div class="modal-body">\n        <h1 class=\'lead\'> These are the droids you are looking for. </h1>\n        <div id=\'downloadEditor\'> </div>\n\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n\n\n<!-- End  -->\n\n\n\n<!-- Publish Modal  -->\n\n<div class="modal fade" id="publishModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n        <h4 class="modal-title" id="myModalLabel"> Publish Plugin </h4>\n      </div>\n      <div class="modal-body">\n        <label> Name: </label> <input disabled class=\'form-control input-lg\' id="requestedPluginName"> </input> </br>\n        <label> Description </label> <textarea class=\'form-control\' id="pluginDescription" rows=\'3\' placeholder="Enter a short description of your plugin."></textarea>\n        </br>\n        <button id=\'finishPublish\' class=\'btn btn-lg btn-success\'> Publish </button>\n        <span id=\'publishStatus\'> </span>\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- End  -->\n\n\n<!-- Error Modal  -->\n\n<div class="modal fade" id="errorModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n        <h4 class="modal-title" id="myModalLabel"> Error </h4>\n      </div>\n      <div class="modal-body">\n        <h2 id=\'errorMessage\' class=\'lead\'> Some error text here </h2>\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- End  -->\n\n<!-- success Modal  -->\n\n<div class="modal fade" id="successModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n        <h4 class="modal-title" id="myModalLabel"> Success </h4>\n      </div>\n      <div class="modal-body">\n        <h2 id=\'errorMessage\' class=\'lead\'> Success message </h2>\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- End  -->\n\n\n<div class=\'navbar\'>\n    <h3>Appcubator</h3>\n    <span class=\'\' id=\'actionBar\'>\n    \t<div class="btn-group float-right">\n    \t  <button id=\'loadButton\' type="button" class="btn btn-default btn-sm">\n    \t  \tLoad\n    \t  </button>\n    \t  <button id=\'previewButton\' type="button" class="btn btn-default btn-sm">Preview</button>\n    \t  <button id=\'downloadButton\' type="button" class="btn btn-default btn-sm">Download</button>\n    \t</div>\n    \t<div class=\'btn-group float-right\'>\n    \t  <button id=\'saveButton\' type="button" class="btn btn-default btn-sm">Save</button>\n    \t  <button id=\'publishButton\' type="button" class="btn btn-success btn-sm">Publish</button>\n    \t</div>\n        <button id=\'toggleSidebar\' type="button" class="btn btn-default btn-sm">Toggle Sidebar </button>\n    </span>\n</div>\n\n<div id=\'pluginEditor\' class=\'container-fluid\'>\n\t<div class=\'\' id=\'pluginNavigator\'>\n\n\t\t<div class=\'plugin-browser\' id=\'pluginBrowser\'> </div>\n        <table class=\'right-panel\'>\n          <tr>\n          <td class="left-panel">\n            <div class=\'col-md-9\' id=\'no-generator\'>\n              No generator selected.\n            </div>\n            <div id=\'editorPanel\'>\n            <!-- Templates -->\n            <h3>Template Editor</h3>\n            <div id=\'templatePanel\'>\n              <ul class="tabs" id="templateList">\n\n              </ul>\n              <div id=\'templateEditor\'></div>\n            </div>\n\n            </hr>\n\n            <div id=\'codeEditorContainer\' class="editor">\n              <h3>Code Editor </h3>\n              <div id=\'codePanel\'>\n                <div id=\'codeEditor\'></div>\n              </div>\n            </div>\n\n            </hr>\n\n            <div id=\'defaultsEditorContainer\' class="editor">\n              <h3>Defaults Editor <span class=\'status\'>  ● </span > </h3>\n              <div id=\'defaultsEditor\'></div>\n            </div>\n\n            </div>\n            </td>\n            <td class="right-cell">\n\n            <div id=\'generatedPanel\'>\n\n\n              <div class=\'col-md-12\' id="generatedPanelInner">\n\n              <ul class="nav nav-tabs">\n                <li class="active"><a href="#home" data-toggle="tab">Generated</a></li>\n                <li><a href="#docs" data-toggle="tab">Docs</a></li>\n                <li><a href="#community" data-toggle="tab">Community</a></li>\n              </ul>\n\n              <!-- Tab panes -->\n              <div class="tab-content">\n                <div class="tab-pane active" id="home"> <div id=\'generatedCode\'></div> </div>\n                <div class="tab-pane" id="docs">\n                  </br>\n\n                    <button type="button" id=\'saveDocsButton\' class="btn btn-default pull-right">\n                        <span class="glyphicon glyphicon glyphicon-floppy-disk"></span>\n                    </button>\n\n                    <button type="button" id=\'editDocsButton\' class="btn btn-default pull-right">\n                        <span class="glyphicon glyphicon glyphicon-pencil"></span>\n                    </button>\n\n                  </br> </br>\n\n                  <div id=\'docsContainer\'>  </div>\n                  <div id=\'docsEditor\' class=\'hidden\'> </div>\n\n                </div>\n                <div class="tab-pane" id="community"> <h1 class=\'lead\'> Coming soon! <h1></div>\n              </div>\n\n\n              </div>\n            </div>\n          </td>\n          </tr>\n\n        </table>\n\t</div>\n</div>\n';

}
return __p
};

this["JST"]["app/scripts/templates/Sidebar.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div id=\'sidebar\'>\n';
 _.each(app.currentObject.plugins, function(plugin, key) { ;
__p += '\n<div data-pluginpath=\'' +
((__t = ( key )) == null ? '' : __t) +
'\' class=\'plugin dir\'>\n\t<span class="plugin-span" data-pluginpath=\'' +
((__t = ( key )) == null ? '' : __t) +
'\'>' +
((__t = ( key )) == null ? '' : __t) +
'</span>\n\n\t';
 var mdls = app.currentObject.plugins[key] ;
__p += '\n\t';
 for (mdl in mdls) { if(mdl == "metadata") continue; ;
__p += '\n\t<div class="module dir" data-modulepath=\'' +
((__t = ( key )) == null ? '' : __t) +
'.' +
((__t = (mdl)) == null ? '' : __t) +
'\'>\n\t\t<span class="module-span" data-modulepath=\'' +
((__t = ( key )) == null ? '' : __t) +
'.' +
((__t = (mdl)) == null ? '' : __t) +
'\'>' +
((__t = (mdl)) == null ? '' : __t) +
'</span>\n\n\t\t';
 var curPlugin =  app.currentObject.plugins[key] ;
__p += '\n\t\t';
 for (generator in curPlugin[mdl]){ ;
__p += '\n\t\t\t<div data-path="' +
((__t = ( key )) == null ? '' : __t) +
'.' +
((__t = (mdl)) == null ? '' : __t) +
'.' +
((__t = ( curPlugin[mdl][generator].name )) == null ? '' : __t) +
'" data-generatorName="' +
((__t = ( curPlugin[mdl][generator].name )) == null ? '' : __t) +
'" class="dir generator">\n\t\t\t\t<span data-generatorName="' +
((__t = ( curPlugin[mdl][generator].name )) == null ? '' : __t) +
'" class="generator-span">' +
((__t = ( curPlugin[mdl][generator].name )) == null ? '' : __t) +
'</span>\n\t\t\t</div>\n\t\t';
 } ;
__p += '\n\t\t<div class="create-generator">\n\t\t\t<div class="create-button">\n\t\t\t\t<label class="icon">+</label><label class="text">New Generator</label>\n\t\t\t</div>\n\t\t\t<form class="create-generator-form" data-path="' +
((__t = ( key )) == null ? '' : __t) +
'.' +
((__t = ( mdl )) == null ? '' : __t) +
'" style="display:none;">\n\t\t\t\t<input type="text" class="newGeneratorNameInput">\n\t\t\t</form>\n\t\t</div>\n\t</div>\n\t';
 } ;
__p += '\n\t<div class="create-module">\n\t\t\t<div class="create-button">\n\t\t\t<label class="icon">+</label><label class="text">New Module</label>\n\t\t</div>\n\t\t<form class="create-module-form" data-modulepath="' +
((__t = ( key )) == null ? '' : __t) +
'" style="display:none;"><input type="text" class="newModuleNameInput"></form>\n\t</div>\n</div>\n';
 }); ;
__p += '\n<div class="create-plugin">\n\t<div class="create-button">\n\t\t<span class="icon">+</span><span class="text">New Plugin</span>\n\t</div>\n\t<form class="create-plugin-form" style="display:none;"><input type="text" id="newPluginNameInput"></form>\n</div>\n</div>\n';

}
return __p
};

  return this["JST"];

});