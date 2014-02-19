var generators = [];

generators.push({
    name: 'model',
    version: '0.1',
    code: function(data, templates) {
        // generate the initial mongoose Schema from fields.
        data.schemaCode = templates.schema({fields: data.fields});

        for (index in data.functions) {
            var sm = data.functions[index];
            data.functions[index] = expand(sm);
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
<% for(var index in functions) { %>\n\
<% var sm = functions[index]; %>\n\
    <% if (sm.instancemethod) { %>\
<%= name %>Schema.methods.<%= sm.name %> = <%= sm.code %>;\n\
    <% } else if (sm.schemaMod) { %>\
(<%= sm.code %>)(<%= name %>Schema);\n\
    <% } else { %>\
<%= name %>Schema.statics.<%= sm.name %> = <%= sm.code %>;\n\
    <% } %>\
<% } %>\n\
\n\
exports.<%= name %> = mongoose.model('<%= name %>', <%= name %>Schema);\n"
    }
});

exports.generators = generators;
