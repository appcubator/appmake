var generators = [];

generators.push({
    name: 'page',
    version: '0.1',
    code: function(data, templates) {
        // The below could be concatUIE template
        data.body = expand(data.body);
        data.head = data.head;
        return templates.code(data);
    },
    templates: {'code':"<html>\n\
    <head>\n\
    <%- head %>\n\
    </head>\n\
    <body>\n\
    <%- body %>\n\
    </body>\n\
</html>\n" }
});

generators.push({
    name: 'concatUIE',
    version: '0.1',
    code: function(data, templates){
        // CSS at the top, then HTML elements, then the corresponding Javascript at the bottom.
        // TODO add some marks/tags to make it easier to find code for debugging.
        var templateLines = [];
        var i, uie;
        for (i = 0; i < data.length; i ++) {
            uie = data[i];
            data[i] = expand(uie);
        }
        for (i = 0; i < data.length; i ++) {
            uie = data[i];
            if (uie.css) templateLines.push("<style>"+uie.css+"</style>");
        }
        for (i = 0; i < data.length; i ++) {
            uie = data[i];
            templateLines.push(uie.html);
        }
        for (i = 0; i < data.length; i ++) {
            uie = data[i];
            if (uie.js) templateLines.push('<script type="text/javascript">'+uie.js+'</script>');
        }

        return templateLines.join("\n");
    },
    templates: {'code':""}
});

exports.generators = generators;
