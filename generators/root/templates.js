var generators = [];

generators.push({
    name: 'page',
    version: '0.1',
    code: function(data, templates) {
        // The below could be concatUIE template
        // name, head, body
        var expandedUIElements = expand(data.uielements);
        data.uielements_html = expandedUIElements.html;
        data.uielements_js = expandedUIElements.js;
        data.uielements_css = expandedUIElements.css;

        data.navbar = expand(data.navbar);
        data.footer = expand(data.footer);
        data._inclString = '<% include modeldefs %>'; // this include statement needs to be inserted into the generated code but it was causing problems inside the template and idk how to escape it in EJS.
        data._header_include = '<% include header %>';
        data._scripts_include = '<% include scripts %>';

        return {
            name: data.name,
            code: templates.code(data)
        };
    },
    defaults: {
        'title': ''
    },
    templates: {
        'code': [
            '<html>',
            '<head>',
            '<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">',
            '<meta charset=\"utf-8\">',
            '<!-- autogenerated css-->',
            '<link rel=\"stylesheet\" type=\"text/css\" href=\"/static/style.css\"></script>',
            '<script src=\"//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js\"></script>',
            '<!-- begin autogenerated api client library -->',
            '<script type=\"text/javascript\"><%= _inclString %></script>',
            '<script src=\"/static/models.js\"></script>',
            '<!-- end autogenerated api client library -->',
            '<title><%= title %></title>',
            '<%= _header_include %>',
            '<%= head %>\n',
            '<style>',
            '<%= uielements_css %>',
            '</style>',
            '</head>',
            '<body>',
            '<!-- BEGIN NAVBAR-->',
            '<%= navbar %>',
            '<!-- END NAVBAR-->',
            '<!-- BEGIN UIELEMENTS -->',
            '<%= uielements_html %>\n',
            '<!-- END UIELEMENTS -->\n',
            '<!-- BEGIN FOOTER-->\n',
            '<%= footer %>',
            '<!-- END FOOTER-->',
            '<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.0/js/bootstrap.min.js"></script>\n',
            '<%= _scripts_include %>',
            '<script>',
            '<%= uielements_js %>',
            '</script>',
            ' </body>\n',
            '</html>'
        ].join('\n')
    }
});

generators.push({
    name: 'uiestateToLess',
    version: '0.1',
    code: function(data, templates) {
        console.log('i');
        var uiestate = data.uiestate;
        console.log(uiestate.headerTexts);
        console.log(uiestate.texts);
        var className = function(clsName) {
            return clsName.split(/\s/).join('.');
        };
        return templates.lessScaffold({
            uie_state: uiestate,
            className: className
        });
    },
    templates: {
        lessScaffold: require('./css_template').tmpl
    }
});

generators.push({
    name: 'header',
    version: '0.1',
    code: function(data, templates) {
        // The below could be concatUIE template
        // name, head, body
        return {
            name: "header",
            code: data
        };
    },
    templates: {}
});

generators.push({
    name: 'scripts',
    version: '0.1',
    code: function(data, templates) {
        // The below could be concatUIE template
        // name, head, body
        return {
            name: "scripts",
            code: data
        };
    },
    templates: {}
});


generators.push({
    name: 'concatUIE',
    version: '0.1',
    code: function(data, templates) {
        // CSS at the top, then HTML elements, then the corresponding Javascript at the bottom.
        // TODO add some marks/tags to make it easier to find code for debugging.
        var templateLines = [];
        var i, uie;
        for (i = 0; i < data.length; i++) {
            uie = data[i];
            data[i] = expand(uie);
        }
        for (i = 0; i < data.length; i++) {
            uie = data[i];
            if (uie.css) templateLines.push("<style>" + uie.css + "</style>");
        }
        for (i = 0; i < data.length; i++) {
            uie = data[i];
            templateLines.push(uie.html);
        }
        for (i = 0; i < data.length; i++) {
            uie = data[i];
            if (uie.js) templateLines.push('<script type="text/javascript">' + uie.js + '</script>');
        }

        return templateLines.join("\n");
    },
    templates: {
        'code': ""
    }
});

generators.push({
    name: 'navbar',
    version: '0.1',
    defaults: {
        brandName : "Default Name",
        links: [
            {
                url: "",
                title: "Page 1"
            },
            {
                url: "",
                title: "Page 2"
            }
        ]
    },
    code: function(data, templates) {

        _.each(data.links, function(link) {
            link.url = link.url || "#";
        });

        var html = templates.html(data);

        return {
            html: html,
            js: "",
            css: ""
        }

    },
    templates: {
        'html': '<div class="navbar navbar-fixed-top navbar-default" id="navbar" role="navigation">' +
            '<div class="container">' +
            '<div class="navbar-header">' +
            '<a href="/" class="navbar-brand"><%= brandName %></a>' +
            '<button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-collapse">' +
            '<span class="icon-bar"></span>' +
            '<span class="icon-bar"></span>' +
            '<span class="icon-bar"></span>' +
            '</button>' +
            '</div>' +
            '<div class="navbar-collapse collapse" id="navbar-collapse">' +
            '<ul class="nav navbar-nav" id="links">' +
            '<% for (var ii = 0; ii < links.length; ii++) { var item = links[ii]; %>' +
            '<li><a href="<%= item.url %>" class="menu-item"><%= item.title %></a></li>' +
            '<% } %>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>'
    }
});

generators.push({
    name: 'footer',
    version: '0.1',
    defaults: {
        customText : "Default Footer - Copyright",
        links: [
            {
                url: "",
                title: "Page 1"
            },
            {
                url: "",
                title: "Page 2"
            }
        ]
    },
    code: function(data, templates) {

        var html = templates.html(data);

        return {
            html: html,
            js: "",
            css: ""
        }
    },
    templates: {
        'html': '<footer class="footer">' +
            '<div class="container">' +
            '<p id="customText" class="footer-text muted"><%= customText %></p>' +
            '<ul class="footer-links" id="links">' +
            '<% for (var ii = 0; ii < links.length; ii++) { var item = links[ii]; %>' +
            '<li><a href="#" class="menu-item"><%= item.title %></a></li>' +
            '<% } %>' +
            '</ul>' +
            '</div>' +
            '<div class="clearfix"></div>' +
            '</footer>'
    }
});

generators.push({
    name: 'layoutColumn',
    version: '0.1',
    code: function(data, templates) {

        var cssLines = [];
        var jsLines = [];
        var htmlLines = [];

        _.each(data.uielements, function(el) {

            var uie = expand(el);
            cssLines.push(uie.css);
            jsLines.push(uie.js);
            htmlLines.push(uie.html);

        });

        data.elements = htmlLines.join('\n');
        var htmlStr = templates.html(data);

        return {
            html: htmlStr,
            js: jsLines.join('\n'),
            css: cssLines.join('\n')
        }
    },

    templates: {
        "html": [
            '<div class="col-md-<%= layout %> ycol">',
            '<%= elements %>',
            '</div>'
        ].join('\n')
    },

    defaults: {
        layout: "12",
        uielements: []
    }
});

generators.push({
    name: 'layoutSection',
    version: '0.1',
    defaults: {
        className: "",
        columns: [],
    },
    code: function(data, templates) {

        var cssLines = [];
        var jsLines = [];
        var htmlLines = [];

        _.each(data.columns, function(column) {

            var expanded_column = expand(column);
            cssLines.push(expanded_column.css);
            jsLines.push(expanded_column.js);
            htmlLines.push(expanded_column.html);

        });


        data.columns = htmlLines.join('\n');
        var htmlStr = templates.html(data);

        return {
            html: htmlStr,
            js: jsLines.join('\n'),
            css: cssLines.join('\n')
        };
    },

    templates: {
        "html": [
            '<div class="row <%= className %>">',
            '<div class="container">',
            '<%= columns %>',
            '</div>',
            '</div>'
        ].join('\n')
    }

});


generators.push({
    name: 'layoutSections',
    version: '0.1',

    code: function(data, templates) {

        var cssLines = [];
        var jsLines = [];
        var htmlLines = [];

        _.each(data, function(sectionData) {
            console.log(sectionData);

            var expanded_section = expand(sectionData);
            cssLines.push(expanded_section.css);
            jsLines.push(expanded_section.js);
            htmlLines.push(expanded_section.html);
        });

        return {
            html: htmlLines.join('\n'),
            js: jsLines.join('\n'),
            css: cssLines.join('\n')
        }

    },

    templates: { }
});


exports.generators = generators;
