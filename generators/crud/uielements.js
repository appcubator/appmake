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
    name: "list",
    version: "0.1",
    templates: {
        "4-8": "<div class=\"row\">\n    <div class=\"container\">\n        <div class=\"text-center ycol\"><%= colheader %></div>\n        <div class=\"col-md-4 ycol\"><%= col0 %></div>\n        <div class=\"col-md-8 ycol\"><%= col1 %></div>\n    </div>\n</div>",
        "html": "<div id=\"<%= modelName %>-list-<%= id %>\">\n</div>",
        "js": "models.<%= modelName %>.find<%= modelName %>({ }, function(err, data){\n    \n    var $list = $('#<%= modelName %>-list-<%= id %>');\n    var template = '<%= rowTemplate %>';\n    \n    _.each(data, function(d) {\n        $list.append(_.template(template, {obj:d}));\n    });\n\n});"
    },
    code: "function(data, templates) {\n    \n    if(!data.id || data.id == -1) {\n        data.id = Math.floor(Math.random()*11);\n    }\n    \n    function getArrangedModels (uielements) {\n\n        var els = {};\n\n        _.each(uielements, function (uielement) {\n\n            var key = uielement.data.layout.col;\n            els[key] = els[key] || [];\n            els[key].push(uielement);\n\n        });\n\n        _.each(els, function (val, key) {\n            els[key] = _.sortBy(val, function(uielement){\n                return parseInt(uielement.data.layout.row, 10);\n            });\n        });\n\n        return els;\n    }\n        \n    function renderRow (rowElements, rowLayout) {\n        \n        var rowLayout = \"4-8\";\n        var rowElements = [\n            {\n                generate: \"uielements.design-button\",\n                data : {\n                    className: \"btn\",\n                    content: \"<%= obj.name %>\",\n                    href: \"<%= obj.url %>\",\n                    layout: {\n                        alignment: \"left\",\n                        col: 0,\n                        row: 1\n                    },\n                    style: \"\",\n                    type: \"button\"\n                }\n            }\n        ];\n        \n        \n        var dictEls  = getArrangedModels(rowElements);\n        var template = templates[rowLayout];\n\n        var expandedEls = {};\n        _.each(dictEls, function(val, key) {\n            expandedEls[\"col\" + key] = _.map(val, function(el){\n            \n                var uie = expand(el);\n    \n                return uie.html;\n\n            }).join('\\n');\n        });\n\n        expandedEls.colheader = expandedEls.colheader || \"\";\n        expandedEls.col0      = expandedEls.col0 || \"\";\n        expandedEls.col1      = expandedEls.col1 || \"\";\n\n        return template(expandedEls);\n    }\n    \n    data.rowTemplate = renderRow(data.row, data.rowLayout).split('\\n').join('');\n\n    return {\n        'html': templates.html(data),\n        'js': templates.js(data),\n        'css': \"\"\n    }\n}",
    defaults: {
        "style": "",
        "modelName": "DefaultTable",
        "rowHeight": "auto",
        "className": "",
        "rowLayout": "12",
        "id": -1,
        "row": []
    }
});


exports.generators = generators;
