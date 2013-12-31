var generators = [];

generators.push({
    name: 'model',
    version: '0.1',
    code: function(data, templates) {
        // generate the initial mongoose Schema from fields.
        data.schemaCode = templates.schema({fields: data.fields});
        data.fields = undefined; // we dont need this anymore.

        if (data.schemaMods === undefined)
            data.schemaMods = [];

        for (var index in data.instancemethods) {
            var im = data.instancemethods[index];
            data.instancemethods[index] = expand(im);
        }

        for (index in data.staticmethods) {
            var sm = data.staticmethods[index];
            data.staticmethods[index] = expand(sm);
        }

        // generate the main model code.
        data.code = templates.main(data);

        // we return the original data along with data.code because the data is used to autogenerate an API
        return data;
    },
    templates: {
        schema: "new Schema({\n\
<% for (var i = 0; i < fields.length; i ++) { %>\n\
    <%= fields[i].name %>: <%= fields[i].type %>,\n\
<% } %>\n\
})",
        main: "var mongoose = require('mongoose');\n\
\n\
var Schema = mongoose.Schema;\n\
\n\
\n\
var <%= name %>Schema = <%= schemaCode %>;\n\
\n\
<% for(var index in instancemethods) { %>\n\
<% var im = instancemethods[index]; %>\n\
<%= name %>Schema.methods.<%= im.name %> = <%- im.code %>;\n\
<% } %>\n\
\n\
<% for(var index in staticmethods) { %>\n\
<% var sm = staticmethods[index]; %>\n\
<%= name %>Schema.statics.<%= sm.name %> = <%- sm.code %>;\n\
<% } %>\n\
\n\
<% for(var index in schemaMods) { %>\n\
<% var sm = schemaMods[index]; %>\n\
(<%- sm %>)(<%= name %>Schema);\n\
<% } %>\n\
\n\
exports.<%= name %> = mongoose.model('<%= name %>', <%= name %>Schema);\n"
    }
});

exports.generators = generators;
