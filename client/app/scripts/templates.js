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
__p += ' <div class="container">\n        <h1>Appcubator Generators</h1>\n        <p class="lead" >Welcome to the Appcubator Generator repository. Explore, discover and contribute to Appcubator! To get started, run <code>npm install -g appcubator-gen</code> </p>\n      </div>\n\n    <div class="container">\n      <!-- Example row of columns -->\n      <div class="row">\n        <div class="col-md-8">\n            <input id=\'repoSearchInput\' class="form-control input-lg " type="text" placeholder="Search by description...">\n        </div>\n        <div class="col-md-1">\n            <h3 class=\'lead\'> or <h3>\n        </div>     \n        <div class="col-md-3">\n            <span>\n                 <button class=\'btn btn-lg btn-default\'> View all generators </button> \n            </span>\n        </div> \n      </div><!-- endrow -->';

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
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<!-- Load file modal -->\n<div class="modal fade" id="loadModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n        <h4 class="modal-title" id="myModalLabel"> Load Resources </h4>\n\n      </div>\n      <div class="modal-body">\n        <h1 class=\'lead\'> To get started, log in to your Appcubator account and select an app. Alternatively, you can add, edit and build on existing plugins in the repository. </h1>\n\n\t\t<form class="form-horizontal" role="form">\n\t\t  <div class="form-group">\n\t\t    <label for="inputEmail3" class="col-sm-2 control-label">Email</label>\n\t\t    <div class="col-sm-10">\n\t\t      <input disabled type="email" class="form-control" id="inputEmail3" placeholder="Email">\n\t\t    </div>\n\t\t  </div>\n\t\t  <div class="form-group">\n\t\t    <label for="inputPassword3" class="col-sm-2 control-label">Password</label>\n\t\t    <div class="col-sm-10">\n\t\t      <input disabled type="password" class="form-control" id="inputPassword3" placeholder="Password">\n\t\t    </div>\n\t\t  </div>\n\t\t  <div class="form-group">\n\t\t    <div class="col-sm-offset-2 col-sm-10">\n\t\t      <div class="checkbox">\n\t\t        <label>\n\t\t          <input disabled type="checkbox"> Remember me\n\t\t        </label>\n\t\t      </div>\n\t\t    </div>\n\t\t  </div>\n\t\t  <div class="form-group">\n\t\t    <div class="col-sm-offset-2 col-sm-10">\n\t\t      <button disabled type="submit" class="btn btn-default">Sign in</button>\n\t\t    </div>\n\t\t  </div>\n\t\t</form>\n\n\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- Download Modal  -->\n\n\n<!-- Load file modal -->\n<div class="modal fade" id="downloadModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n        <h4 class="modal-title" id="myModalLabel"> Load Resources </h4>\n\n      </div>\n      <div class="modal-body">\n        <h1 class=\'lead\'> These are the droids you are looking for. </h1>\n        <div id=\'downloadEditor\'> </div>\n\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n\n\n<!-- End  -->\n\n<div class=\'navbar\'>\n\t\t\t\t<h3>Appcubator</h3>\n\t\t\t\t<span class=\'\' id=\'actionBar\'>\n\t\t\t\t\t<div class="btn-group float-right">\n\t\t\t\t\t  <button id=\'loadButton\' type="button" class="btn btn-default btn-sm">\n\t\t\t\t\t  \tLoad\n\t\t\t\t\t  </button>\n\t\t\t\t\t  <button id=\'previewButton\' type="button" class="btn btn-default btn-sm">Preview</button>\n\t\t\t\t\t  <button id=\'downloadButton\' type="button" class="btn btn-default btn-sm">Download</button>\n\t\t\t\t\t</div> \n\t\t\t\t\t<div class=\'btn-group float-right\'>\n\t\t\t\t\t  <button id=\'saveButton\' type="button" class="btn btn-default btn-sm">Save</button>\n\t\t\t\t\t  <button id=\'publishButton\' type="button" class="btn btn-success btn-sm">Publish</button>\n\t\t\t\t\t</div>\n\t\t\t\t</span>\n<!-- \t\t\t\t<span class=\'float-right\' id=\'searchBar\'>\n\t\t\t\t\t<input type="text" class="form-control">\n\t\t\t\t    <button class="btn btn-default" type="button">Go!</button>\n\t\t\t\t</span> -->\n</div>\n\n<div id=\'pluginEditor\' class=\'container-fluid\'>\n\t<div class=\'\' id=\'pluginNavigator\'>\n\t\t\n\t\t<div class=\'col-md-3\' id=\'pluginBrowser\'></div>\n\t\t\n\t\t<div class=\'col-md-6\' id=\'editorPanel\'> \n\t\t\t<h3>Template Editor</h3>\n\t\t\t<div class=\'row\' id=\'templatePanel\'> \n\t\t\t\t<ul class="nav nav-tabs">\n\t\t\t\t   \t';
 if (app.currentGenerator !== undefined && app.currentObject !== undefined && app.currentModule !== undefined && app.currentPlugin !== undefined) { ;
__p += '\n\t\t\t\t\t  \t\n\t\t\t\t\t  \t';
 var o = app.currentObject.plugins[app.currentPlugin][app.currentModule]; ;
__p += '\n\t\t\t\t\t  \t';
 for (var i = 0; i < o.length; o++) { ;
__p += '\n\t\t\t\t\t  \t\t';
 if (o[i].name === app.currentGenerator) { ;
__p += '\n\t\t\t\t\t  \t\t\t';
 for (template in o[i].templates) { ;
__p += '\n\t\t\t\t\t  \t\t\t\t';
 if (template == app.currentTemplate) { ;
__p += '\n\t\t\t\t\t  \t\t\t\t\t<li templatename=\'' +
((__t = (template)) == null ? '' : __t) +
'\'class=\'active selectTemplateButton\'> <a href=\'#\'> ' +
((__t = ( template )) == null ? '' : __t) +
' </a> </li>\n\t\t\t\t\t  \t\t\t\t';
 } else { ;
__p += '\n\t\t\t\t\t  \t\t\t\t\t<li templatename=\'' +
((__t = (template)) == null ? '' : __t) +
'\'class=\'selectTemplateButton\'> <a href=\'#\'> ' +
((__t = ( template )) == null ? '' : __t) +
' </a> </li>\n\t\t\t\t\t  \t\t\t\t';
 } ;
__p += '\n\t\t\t\t\t  \t\t\t';
 } ;
__p += '\n\t\t\t\t\t  \t\t';
 } ;
__p += '\n\t\t\t\t\t  \t';
 } ;
__p += '\n\t\t\t\t  \t';
 } ;
__p += '\n\t\t\t\t  \t<li class="pull-right">\n\t\t\t\t  \t\t<span id=\'createTemplateGroup\' class="pull-right">\n\t\t\t\t\t\t\t<div class="input-group">\n\t\t\t\t\t\t\t  <span class="input-group-btn">\n\t\t\t\t\t\t\t    <button class="btn btn-default" id=\'createNewTemplateButton\' type="button">Create</button>\n\t\t\t\t\t\t\t  </span>\t\n\t\t\t\t\t\t\t  <input type="text" placeholder="template name"id=\'newTemplateNameInput\' class="form-control">\n\t\t\t\t\t\t\t</div><!-- /input-group -->\n\t\t\t\t\t\t</span>\n\t\t\t\t  \t</li>\n\t\t\t\t</ul>\n\t\t\t\t<div class=\'col-md-12\'>\n\t\t\t\t\t<div id=\'templateEditor\'></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t</hr>\n\n\t\t\t<h3>Code Editor</h3>\n\t\t\t<div class=\'row\' id=\'codePanel\'> \n\t\t\t\t<div class=\'col-md-12\' > <div id=\'codeEditor\'>   </div> </div>\n\t\t\t</div>\n\n\t\t\t</hr>\n\n\t\t\t<h3>Defaults Editor</h3>\n\t\t\t<div class=\'col-md-12\' >\n\t\t\t\t<div id=\'defaultsEditor\'></div>\n\t\t\t</div>\n\n\t\t</div>\n\t\t<div class=\'col-md-3\' id=\'generatedPanel\'> \n\t\t\t<h3>Generated Code</h3>\n\t\t\t<div class=\'col-md-12\'>\n\t\t\t\t<div id=\'generatedCode\'></div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n';

}
return __p
};

this["JST"]["app/scripts/templates/Sidebar.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (app.browsingLocalGenerators === true) { ;
__p += '\n\t<div id=\'pluginSelector\'>\n\t\t<h6><span class="label label-default">CURRENT PLUGIN</span></h6>\n\t\t<div class="dropdown">\n\t\t  <a class=\'btn btn-lg btn-default\' data-toggle="dropdown" id=\'pluginSelectorInput\' href="#">\n\t\t  \t' +
((__t = ( app.currentPlugin )) == null ? '' : __t) +
'<span class="caret"></span>\n\t\t  </a>\n\t\t  <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">\n\t\t  \t';
 _.each(app.currentObject.plugins, function(plugin, key) { ;
__p += '\n\t\t\t\t';
 if (key != app.currentPlugin) { ;
__p += '\n\t\t\t\t<li pluginname=\'' +
((__t = ( key )) == null ? '' : __t) +
'\' class=\'selectPluginButton\'><a href=\'#\'>' +
((__t = ( key )) == null ? '' : __t) +
'</a></li>\n\t\t\t\t';
 }  ;
__p += '\n\t\t\t';
 }); ;
__p += '\n\t\t  </ul>\n\t\t</div>\n\t\t<div class="input-group">\n\t\t \t<input type="text" id=\'newPluginNameInput\' class="form-control"></input>\n\t\t  \t<span class="input-group-btn">\n\t\t    \t<button class="btn btn-primary btn-sm" id=\'createNewPluginButton\'type="button"> Create Plugin</button>\n\t\t\t</span>\n\t\t</div><!-- /input-group -->\n\n\t\t<div class=\'pluginInfo\'>\n<!-- \t\t\t<h6><span class="label label-default">AUTHOR</span>  \n\t\t\t\t<input disabled type=\'text\' placeholder=\'Your Email\'> </input>  \n\t\t\t</h6>\n\n\t\t\t<h6><span class="label label-default">DOCS</span>   \n\t\t\t\t<input disabled type=\'text\'  placeholder=\'http://yourdocs.com\'> </input>  \n\t\t\t</h6>\n\n\t\t\t<h6><span class="label label-default">REPO</span>  \n\t\t\t\t<input disabled type=\'text\' placeholder=\'git.com/yourRepo\'> </input>  \n\t\t\t</h6> -->\n\n\t\t\t<h6><span class="label label-default">CURRENT MODULE</span></h6>\n\n\t\t\t\t<div class="dropdown">\n\n\t\t\t\t  \t<a class=\'btn btn-default btn-block btn-default\' data-toggle="dropdown" id=\'moduleSelector\' href="#">\n\t\t\t\t  \t\t';
 if (app.currentModule === undefined) { ;
__p += '\n\t\t\t\t  \t\t\tNo module selected\n\t\t\t\t  \t\t';
 } else {;
__p += '\n\t\t\t\t  \t\t\t' +
((__t = ( app.currentModule )) == null ? '' : __t) +
' <span class="caret"></span>\n\t\t\t\t  \t\t';
 } ;
__p += '\n\t\t\t\t  \t</a>\n\n\t\t\t\t\t <ul class="dropdown-menu list-group" id=\'moduleList\' role="menu" aria-labelledby="dLabel">\n\t\t\t\t\t  \t\t';
 if (app.browsingLocalGenerators === true) { ;
__p += '\n\t\t\t\t\t  \t\t\t';
 var mdls = app.currentObject.plugins[app.currentPlugin] ;
__p += '\n\t\t\t\t\t  \t\t';
 } else {;
__p += '\n\t\t\t\t\t  \t\t\t';
 var mdls = app.currentObject.plugins[app.currentPlugin] ;
__p += '\n\t\t\t\t\t  \t\t';
 } ;
__p += '\n\t\t\t\t\t  \t\t';
 for (mdl in mdls) {  console.log(mdl); ;
__p += '\n\t\t\t\t\t  \t\t<li class="selectModuleButton list-group-item" moduleName=\'' +
((__t = (mdl)) == null ? '' : __t) +
'\'> ' +
((__t = (mdl)) == null ? '' : __t) +
' </li>\n\t\t\t\t\t  \t\t';
 } ;
__p += '\t\t\t\t  \t\t\n\t\t\t\t\t </ul>\n\t\t\t\t</div>\n\t\t\t\t<div class="input-group">\n\t\t\t\t \t<input type="text" id=\'newModuleNameInput\' class="form-control"></input>\n\t\t\t\t  \t<span class="input-group-btn">\n\t\t\t\t    \t<button class="btn btn-primary btn-sm" id=\'createNewModuleButton\'type="button"> Create Module</button>\n\t\t\t\t  \t</span>\n\t\t\t\t</div><!-- /input-group -->\n\t\t</div>\n\t</div>\n';
 }  ;
__p += '\n\n<div class=\'\' id=\'generatorBrowser\'>\n\n\t\t<h6><span class="label label-default">GENERATORS</span></h6>\n\t\t<ul class="list-group generators">\n\t\t  ';
 if ((app.currentObject !== undefined) && (app.currentModule !== undefined) && (app.currentPlugin !== undefined)) { ;
__p += '\n\t\t  \t';
 if (app.browsingLocalGenerators) { ;
__p += '\n\t\t  \t\t';
 var o = app.currentObject.plugins[app.currentPlugin]; ;
__p += '\n\t\t  \t';
} else { ;
__p += '\n\t\t  \t\t';
 var o = app.currentObject.plugins[app.currentPlugin]; ;
__p += '\n\t\t  \t';
 } ;
__p += '\n\t\t\t';
 for (generator in o[app.currentModule]){ ;
__p += '\n\t\t\t\t';
 if (o[app.currentModule][generator].name === app.currentGenerator) { ;
__p += '\n\t\t\t\t<li generatorName="' +
((__t = (o[app.currentModule][generator].name)) == null ? '' : __t) +
'"class="active list-group-item selectGeneratorButton">\n\t\t  \t\t\t' +
((__t = (generator)) == null ? '' : __t) +
' - <b> ' +
((__t = (o[app.currentModule][generator].name)) == null ? '' : __t) +
' </b></li>\n\t\t\t\t';
 } else { ;
__p += '\n\t\t  \t\t<li generatorName="' +
((__t = (o[app.currentModule][generator].name)) == null ? '' : __t) +
'"class="list-group-item selectGeneratorButton">\n\t\t  \t\t\t' +
((__t = (generator)) == null ? '' : __t) +
' - <b> ' +
((__t = (o[app.currentModule][generator].name)) == null ? '' : __t) +
' </b></li>\n\t\t  \t\t';
 };
__p += '\n\n\t\t  \t';
 } ;
__p += '\n\t\t  ';
 } ;
__p += '\n\t\t</ul>\n\n\t\t<div class="input-group">\n\t\t\t<input id=\'newGeneratorNameInput\' class=\'form-control\' placeholder=\'Generator Name\'> </input>\n\t\t\t<span class="input-group-btn">\n\t\t\t<button id=\'createNewGeneratorButton\' class=\'btn btn-primary btn-sm\'>Create Generator </button>\n\t\t\t</span>\n\t\t</div>\n</div>';

}
return __p
};

  return this["JST"];

});