var generators = [];

generators.push({
    name: 'create',
    version: '0.1',
    code: function(data, templates) {
        /* Example (subject to change)
        {
          generate: "crud.uielements.create",
          data: { fields: [['name', { type: 'text', placeholder: 'Name'} ],
                           ['url', { type: 'text', placeholder: 'URL'}   ]],
                  id: 'testform',
                  redirect: 'https://www.google.com/' }
        }
          */
        var uie = { html: templates.html(data),
                    js: templates.js(data),
                    css: '' };
        return uie;
    },
    templates: {
        "html": "<form id=\"<%= id %>\">\n"+
                "<% for (var i = 0; i < fields.length; i ++) { %>\n"+
                "<input type=\"<%= fields[i][1].type %>\" name=\"<%= fields[i][0] %>\" placeholder=\"<%= fields[i][1].placeholder %>\"><br>\n"+
                "<% } %>\n"+
                "<input type=\"submit\" value=\"Submit\"><br>\n"+
                "</form>\n",
        "js": "$('#<%= id %>').submit(function(){\n"+
              "    var formdata = {};\n"+
              "    formdata.name = $('#<%= id %> input[name=\"name\"]').val();\n"+
              "    formdata.url = $('#<%= id %> input[name=\"url\"]').val();\n"+
              "    models.Picture.createPicture(formdata, function(err, data){\n"+
              "        console.log(data);\n"+
              "        if (err) {\n"+
              "            // Do whatever you want with user errors\n"+
              "            alert(err);\n"+
              "        }\n"+
              "        else {\n"+
              "            // You can redirect on success\n"+
              "            location.href = '<%= redirect %>';\n"+
              "        }\n"+
              "    });\n"+
              "    return false;\n"+
              "});\n",
    }
});

exports.generators = generators;
