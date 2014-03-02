var generators = [];

generators.push({
    name: 'create',
    version: '0.1',
    defaults: {
        className: "",
        style: "",
        fields: [],
        redirect: "/",
        id: Math.floor(Math.random() * 11),
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
            "</form>",

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

generators.push(
    {
        "templates": {
            "4-8": "<div class=\"row\">\n    <div class=\"container\">\n        <div class=\"text-center ycol\"><%= colheader %></div>\n        <div class=\"col-md-4 ycol\"><%= col0 %></div>\n        <div class=\"col-md-8 ycol\"><%= col1 %></div>\n    </div>\n</div>",
            "html": "<div id=\"<%= modelName %>-list-<%= id %>\">\n</div>",
            "row_html": "<div class=\"row\">\n    <div class=\"container\">\n        <%= row_content_str %>\n    </div>\n</div>",
            "js": "models.<%= modelName %>.find<%= modelName %>({ }, function(err, data){\n    \n    var $list = $('#<%= modelName %>-list-<%= id %>');\n    var template = '<%= rowTemplate %>';\n    \n    console.log(data);\n    \n    _.each(data, function(d) {\n        $list.append(_.template(template, {obj:d}));\n    });\n    \n    if(!data || data.length == 0) {\n        $list.append('No results listed');\n    }\n});"
        },
        "code": "function(data, templates) {\n    \n    if(!data.id || data.id == -1) {\n        data.id = Math.floor(Math.random()*11);\n    }\n        \n    function renderRow (rowData) {\n        \n        var expandedEls = {};\n        var rowStr = _.map(rowData.columns, function(column) {\n            console.log(column);\n            return expand(column).html;\n        }).join('\\n');\n\n        return rowStr;\n    }\n\n    data.row_content_str = renderRow(data.row).split('\\n').join('');\n    data.rowTemplate = templates.row_html(data).split('\\n').join('');\n\n    return {\n        'html': templates.html(data),\n        'js': templates.js(data),\n        'css': \"\"\n    }\n}",
        "name": "list",
        "version": "0.1",
        "defaults": {
            "className": "",
            "style": "",
            "modelName": "DefaultTable",
            "id": -1,
            "row": {
                "rowHeight": "auto",
                "columns": [{
                    "data": {
                        "uielements": [{
                            "data": {
                                "className": "btn",
                                "style": "",
                                "layout": {
                                    "alignment": "left",
                                    "row": 1
                                },
                                "content": "Left Col >",
                                "href": "http://TOOLOBAPAGE.html",
                                "type": "button"
                            },
                            "generate": "uielements.design-button"
                        }],
                        "layout": "4",
                        "elements": "<a href=\"http://TOOLOBAPAGE.html\" class=\"btn btn\" style=\"\">Left Col ></a>"
                    },
                    "generate": "templates.layoutColumn"
                }, {
                    "data": {
                        "uielements": [{
                            "data": {
                                "className": "btn",
                                "style": "",
                                "layout": {
                                    "alignment": "left",
                                    "row": 1
                                },
                                "content": "Right Col >",
                                "href": "http://TOOLOBAPAGE.html",
                                "type": "button"
                            },
                            "generate": "uielements.design-button"
                        }],
                        "layout": "8",
                        "elements": "<a href=\"http://TOOLOBAPAGE.html\" class=\"btn btn\" style=\"\">Right Col ></a>"
                    },
                    "generate": "templates.layoutColumn"
                }]
            }
        }
    }
);


exports.generators = generators;