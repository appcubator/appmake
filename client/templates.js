define(function(){

this["JST"] = this["JST"] || {};

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
__p += '<div class="container">\n  <h1>Appcubator Generators</h1>\n  <p class="lead" >Welcome to the Appcubator Generator repository. Explore, discover and contribute to Appcubator! To get started, run <code>npm install -g appcubator-gen</code> </p>\n</div>\n\n<div class="container">\n  <div class="row">\n\n    <div class="col-md-8">\n        <input id=\'repoSearchInput\' class="form-control input-lg " type="text" placeholder="Search by description..."> \n        </input>\n    </div>\n\n    <div class="col-md-1">\n        <h3 class=\'lead\'> or <h3>\n    </div>  \n\n    <div class="col-md-3">\n        <span>\n             <button class=\'btn btn-lg btn-default\'> View all generators </button> \n            <button class=\'btn btn-lg btn-default\'> Plugin Editor </button> \n\n        </span>\n    </div>\n     \n  </div>\n</div>\n';

}
return __p
};

  return this["JST"];

});