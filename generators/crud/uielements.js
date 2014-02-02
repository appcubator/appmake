var generators = [];

generators.push({
    name: 'form-field',
    version: '0.1',
    code: function(data, templates) {
        /*  */

        var template = templates[data.displayType];
        data.style = data.style || 'display:block';

        return template(data);
    },
    templates: {
        "single-line-text": '<input type="text" name="<%= field_name %>" placeholder="<%= placeholder %>">',
        "text": '<input type="text" name="<%= field_name %>" placeholder="<%= placeholder %>">',
        "paragraph-text": '<textarea name="<%= field_name %>" placeholder="<%= placeholder %>"></textarea>',
        "dropdown": '<select name="<%= field_name %>" class="dropdown"><% _.each(options.split(\',\'), function(option, ind){ %><option><%= option %></option><% }); %></select>',
        "option-boxes": '<span class="option-boxes"><% _(field.get(\'options\').split(\',\')).each(function(option, ind){ %><input id="opt-<%= ind %>" class="field-type" type="radio" name="types" value=""> <label class="opt" for="opt-<%= ind %>"><%= option %></label><br  /><% }); %></span>',
        "password-text": '<input name="<%= field_name %>" type="password" placeholder="<%= placeholder %>">',
        "email-text": '<div class="email"><input type="text" placeholder="<%= placeholder %>"></div>',
        "button": '<div class="btn"><%= placeholder %></div>',
        "image-uploader": '<div class="upload-image btn">Upload Image</div>',
        "file-uploader": '<div class="upload-file btn">Upload File</div>',
        "date-picker": '<input name="<%= field_name %>" type="text" placeholder="<%= placeholder %>"><img style="margin-left:5px;" src="/static/img/calendar-icon.png">'
    }
});

generators.push({
    name: 'create',
    version: '0.1',
    code: function(data, templates) {
        /* Example (subject to change)
        {
            generate: "crud.uielements.create",
            data: { fields: [{ generate: 'form-field',
                               data: {displayType:'single-line-text',
                                      field_name:'name',
                                      placeholder: 'Name'}
                             },{generate: 'form-field',
                                data:{ displayType:'single-line-text',
                                       field_name: 'url',
                                       placeholder: 'URL'}}],
                    id: 'testform',
                    redirect: '/?success=true' }
          */

        data.className = data.className || "";
        data.style = data.style || "";

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
            "    models.Picture.createPicture(formdata, function(err, data){\n" +
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

exports.generators = generators;
