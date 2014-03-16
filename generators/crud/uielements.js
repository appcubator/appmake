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

            "js": "$.fn.serializeObject = function()\n" +
                "{ var o = {}; \n" +
                   "var a = this.serializeArray(); \n" +
                   "$.each(a, function() { \n" +
                      " if (o[this.name]) { \n" +
                           "if (!o[this.name].push) { \n" +
                               "o[this.name] = [o[this.name]]; \n" +
                           "} \n" +
                           "o[this.name].push(this.value || ''); \n" +
                       "} else { \n" +
                           "o[this.name] = this.value || ''; \n" +
                       "} \n" +
                   "}) \n;" +
                   "return o; \n" +
                "}; \n" +
            " $('#<%= id %>').submit(function(e){\n" +
            "    e.preventDefault(); \n" +
            "    var formdata = {};\n" +
            "    formdata = $( this ).serializeObject(); console.log(formdata);" +
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
            "js": "models.<%= modelName %>.find<%= modelName %>({ }, function(err, data){\n    \n    var $list = $('#<%= modelName %>-list-<%= id %>');\n    var template = '<%= rowTemplate %>';\n    \n    \n    _.each(data, function(d) {\n        $list.append(_.template(template, {obj:d}));\n  <%= afterRenderJS %> \n  });\n    \n    if(!data || data.length == 0) {\n        $list.append('No results listed');\n    }\n});"
        },
        "code": function(data, templates) {
            if(!data.id || data.id == -1) {
                data.id = Math.floor(Math.random()*11);
            }

            var rowEls = _.map(data.row.columns, function(column) {
                return expand(column);
            });

            function renderRowStr () {
                var rowStr = rowEls.map(function(rowEl){ return rowEl.html; }).join('\n');
                return rowStr;
            }

            function renderRowJs () {
                var rowStr = rowEls.map(function(rowEl){ return rowEl.js; }).join('\n');
                return rowStr;
            }

            data.row_content_str = renderRowStr().split('\n').join('');
            data.row_content_str = data.row_content_str.replace(/<%/g, "<' + '%");
            data.rowTemplate = templates.row_html(data).split('\n').join('');
            data.afterRenderJS = renderRowJs();

            return {
                'html': templates.html(data),
                'js': templates.js(data),
                'css': ''    
            }
        },
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