var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var <%= model.name %>Schema = new Schema({
<% for(var i = 0; i < model.fields.length; i ++) { %>
<% var field = model.fields[i]; %>
  <%= field.name %>:  <%= field.type %>,
<% } %>
});

<% for(var i = 0; i < model.instancemethods.length; i ++) { %>
<% var im = model.instancemethods[i]; %>
<%= model.name %>Schema.methods.<%= im.name %> = function(<%= im.args.join(', ') %>) {
  <%= im.code %>
}
<% } %>

<% for(var i = 0; i < model.staticmethods.length; i ++) { %>
<% var sm = model.staticmethods[i]; %>
<%= model.name %>Schema.methods.<%= sm.name %> = function(<%= sm.args.join(', ') %>) {
  <%= sm.code %>
}
<% } %>

exports.<%= model.name %> = mongoose.model('<%= model.name %>', <%= model.name %>Schema);
