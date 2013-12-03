var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_ADDR);

var Schema = mongoose.Schema;


var <%= model.name %>Schema = new Schema({
<% for(var fieldName in model.fields) { %>
<% var field = model.fields[fieldName]; %>
  <%= fieldName %>:  <%= field %>,
<% } %>
});

<% for(var imName in model.instancemethods) { %>
<% var im = model.instancemethods[imName]; %>
<%= model.name %>Schema.methods.<%= imName %> = <%= im %>;
<% } %>

<% for(var smName in model.staticmethods) { %>
<% var sm = model.staticmethods[smName]; %>
<%= model.name %>Schema.statics.<%= smName %> = <%= sm %>;
<% } %>

exports.<%= model.name %> = mongoose.model('<%= model.name %>', <%= model.name %>Schema);
