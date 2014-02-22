var generators = [];

generators.push({
    name: 'create',
    version: '0.1',
    defaults: {
        className: "",
        style: "",
        fields: [],
        redirect: "/",
        id: Math.floor(Math.random()*11),
        modelName: "DefaultTable"
    },
    code: function(data, templates) {
        /* Example (subject to change)
        {
            generate: "crud.uielements.create",
            data: { fields: [{ generate: 'uielements.form-field',
                               data: {displayType:'single-line-text',
                                      field_name:'name',
                                      placeholder: 'Name'}
                             },{generate: 'uielements.form-field',
                                data:{ displayType:'single-line-text',
                                       field_name: 'url',
                                       placeholder: 'URL'}}],
                    id: 'testform',
                    redirect: '/?success=true' }
          */
        data.formFields = _.map(data.fields, expand).join('\n');

        var uie = {
            html: templates.html(data),
            js: templates.js(data),
            css: ''
        };
        return uie;
    },
    templates: {

        "html": "<form id=\"<%= id %>\" class=\"<%= className %>\" style=\"<%= style %>\">\n" +
            "<%= formFields %>" +
            "<input type=\"submit\" value=\"Submit\"><br>\n" +
            "</form>\n",

        "js": "$('#<%= id %>').submit(function(){\n" +
            "    var formdata = {};\n" +
            "    formdata.name = $('#<%= id %> input[name=\"name\"]').val();\n" +
            "    formdata.url = $('#<%= id %> input[name=\"url\"]').val();\n" +
            "    models.<%= modelName %>.create<%= modelName %>(formdata, function(err, data){\n" +
            "        console.log(data);\n" +
            "        if (err) {\n" +
            "            // Do whatever you want with user errors\n" +
            "            alert(err);\n" +
            "        }\n" +
            "        else {\n" +
            "            // You can redirect on success\n" +
            "            location.href = '<%= redirect %>';\n" +
            "        }\n" +
            "    });\n" +
            "    return false;\n" +
            "});\n",
    }
});

generators.push({
    "name": "list",
    "templates": {
        "html": "<div id=\"<%= modelName %>-list-<%= id %>\">\n</div>",
        "js": "models.<%= modelName %>.find<%= modelName %>({}, function(err, data){\n    \n    var $list = $('#<%= modelName %>-list-<%= id %>');\n    var template = <%= rowTemplate %>;\n    \n    _.each(data, function(d) {\n        $list.append(template);\n    });\n\n});"
    },
    "code": "function(data, templates) {\n    \n    if(!data.id || data.id == -1) {\n        data.id = Math.floor(Math.random()*11);\n    }\n    \n    return {\n        'html': \"<div id=\\\"piclist\\\"></div>\",\n        'js': templates.js(data),\n        'css': \"\"\n    }\n}",
    "version": "0.1",
    "defaults": {
        "style": "",
        "modelName": "DefaultTable",
        "rowHeight": "auto",
        "className": "",
        "id": -1,
        "row": []
    }
});


exports.generators = generators;
