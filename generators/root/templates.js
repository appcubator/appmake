var generators = [];

generators.push({
    name: 'page',
    version: '0.1',
    code: function(data, templates) {
        // The below could be concatUIE template
        // name, head, body
        data.uielements = expand(data.uielements);
        data.navbar = expand(data.navbar);
        data.footer = expand(data.footer);
        data._inclString = '<% include modeldefs %>';// this include statement needs to be inserted into the generated code but it was causing problems inside the template and idk how to escape it in EJS.
        return {name: data.name, code: templates.code(data)};
    },
    templates: {'code':"<html>\n \
    <head>\n \
\
    <!-- autogenerated css--> \
    <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/style.css\"></script> \
    <script src=\"//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js\"></script>\
\
    <!-- begin autogenerated api client library --> \
    <script type=\"text/javascript\"><%= _inclString %></script>\n \
    <script src=\"/static/models.js\"></script> \
    <!-- end autogenerated api client library --> \
    <%= head %>\n \
    </head>\n \
    <body>\n \
    <!-- BEGIN NAVBAR-->\n \
    <%= navbar %>\n \
    <!-- END NAVBAR-->\n \
    <!-- BEGIN UIELEMENTS -->\n \
    <%= uielements %>\n \
    <!-- END UIELEMENTS -->\n \
    <!-- BEGIN FOOTER-->\n \
    <%= footer %>\n \
    <!-- END FOOTER-->\n \
    </body>\n \
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

generators.push({
    name: 'navbar',
    version: '0.1',
    code: function(data, templates){
        return templates.html({ data: data });
    },
    templates: {
        'html': '<div class="navbar navbar-fixed-top navbar-default" id="navbar">' +
          // '<button id="edit-navbar-btn">Edit Navbar</button>' +
            '<div class="container">' +
              '<div class="navbar-header">' +
               '<a href="#" class="navbar-brand"><%= data.brandName %></a>' +
                '<button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">' +
                  '<span class="icon-bar"></span>' +
                  '<span class="icon-bar"></span>' +
                  '<span class="icon-bar"></span>' +
                '</button>' +
              '</div>' +
              '<div class="navbar-collapse collapse" data-toggle="collapse">' +
                '<ul class="nav navbar-nav" id="links">' +
                    '<% for (var ii = 0; ii < data.links.length; ii++) { var item = data.links[ii]; %>' +
                    '<li><a href="#" class="menu-item"><%= item.title %></a></li>' +
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
    code: function(data, templates){
        return templates.html({ data: data });
    },
    templates: {
        'html': '<div class="container">' +
            '<p id="customText" class="footer-text muted"><%= data.customText %></p>' +
            '<ul class="footer-links" id="links">' +
                '<% for (var ii = 0; ii < data.links.length; ii++) { var item = data.links[ii]; %>' +
                '<li><a href="#" class="menu-item"><%= item.title %></a></li>' +
                '<% } %>' +
            '</ul>' +
          '</div>' +
          '<div class="clearfix"></div>'
    }
});


generators.push({
    name: 'layoutSections',
    version: '0.1',
    code: function(data, templates){

        function getArrangedModels (uielements) {

            var els = {};

            _.each(uielements, function (uielement) {

                var key = uielement.data.layout.col;
                els[key] = els[key] || [];
                els[key].push(uielement);

            });

            _.each(els, function (val, key) {
                els[key] = _.sortBy(val, function(uielement){
                    return parseInt(uielement.data.layout.row, 10);
                });
            });

            return els;
        }

        function renderSection (sectionObj) {

            var dictEls  = getArrangedModels(sectionObj.uielements);
            var template = templates[sectionObj.layout];

            var expandedEls = {};
            _.each(dictEls, function(val, key) {
                expandedEls["col" + key] = _.map(val, function(el){
                    
                    return expand(el).html;

                }).join('\n');
            });

            expandedEls.colheader = expandedEls.colheader || "";
            expandedEls.className = sectionObj.className || "";

            return template(expandedEls);
        }

        var str = _.map(data, renderSection);
        str = str.join('\n');

        return str;
    },
    templates: {
            "12":[
                '<div class="row <%= className %>">',
                    '<div class="container">',
                        '<div class="ycol"><%= colheader %></div>',
                        '<div class="col-md-12 ycol"><%= col0 %></div>',
                    '</div>',
                '</div>'].join('\n'),
            "3-3-3-3" : [
                '<div class="row <%= className %>">',
                    '<div class="container">',
                        '<div class="text-center ycol"><%= colheader %></div>',
                        '<div class="col-md-3 ycol"><%= col0 %></div>',
                        '<div class="col-md-3 ycol"><%= col1 %></div>',
                        '<div class="col-md-3 ycol"><%= col2 %></div>',
                        '<div class="col-md-3 ycol"><%= col3 %></div>',
                    '</div>',
                '</div>'].join('\n'),
            "4-4-4": [
                '<div class="row <%= className %>">',
                    '<div class="container">',
                        '<div class="text-center ycol"><%= colheader %></div>',
                        '<div class="col-md-4 ycol"><%= col0 %></div>',
                        '<div class="col-md-4 ycol"><%= col1 %></div>',
                        '<div class="col-md-4 ycol"><%= col2 %></div>',
                    '</div>',
                '</div>'].join('\n'),
             "8-4": [
                '<div class="row <%= className %>">',
                    '<div class="container">',
                        '<div class="text-center ycol"><%= colheader %></div>',
                        '<div class="col-md-8 ycol"><%= col0 %></div>',
                        '<div class="col-md-4 ycol"><%= col1 %></div>',
                    '</div>',
                '</div>'].join('\n'),
            "4-8": [
                '<div class="row <%= className %>">',
                    '<div class="container">',
                        '<div class="text-center ycol"><%= colheader %></div>',
                        '<div class="col-md-4 ycol"><%= col0 %></div>',
                        '<div class="col-md-8 ycol"><%= col1 %></div>',
                    '</div>',
                '</div>'].join('\n')
    }
});


exports.generators = generators;
