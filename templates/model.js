var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var <%= model.name %>Schema = new Schema({
<% for(var i = 0; i < fields.length; i ++) { %>
<% var field = fields[i]; %>
  <%= field.name %>:  <%= field.type %>,
<% } %>
});


<% for(var i = 0; i < model.instancemethods.length; i ++) { %>
<% var im = model.instancemethods[i]; %>
<%= model.name %>Schema.methods.<%= im.name %> = function(<%= im.args.join(', ') %>) {
  <%= im.code %>
}
<% } %>

