var generators = [];

generators.push({
    name: 'page',
    version: '0.1',
    code: function(data, templates) {
        // The below could be concatUIE template
        // name, head, body
        data.body = expand(data.body);
        data._inclString = '<% include modeldefs %>';// this include statement needs to be inserted into the generated code but it was causing problems inside the template and idk how to escape it in EJS.
        return {name: data.name, code: templates.code(data)};
    },
    templates: {'code':"<html>\n \
    <head>\n \
\
    <!-- autogenerated css--> \
    <link href=\"/static/style.css\"></script> \
    <script src=\"//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js\"></script>\
\
    <!-- begin autogenerated api client library --> \
    <script type=\"text/javascript\"><%= _inclString %></script>\n \
    <script src=\"/static/models.js\"></script> \
    <!-- end autogenerated api client library --> \
    <%= head %>\n \
    </head>\n \
    <body>\n \
    <%= navbar %> \n \
    <%= body %>\n \
    <%= footer %>\n \
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
    name: 'rowcolUIE',
    version: '0.1',
    code: function(data, templates) {
        
        function split_to_cols(uielements, leftOffset) {
            // """Given some uielements, separate them into non-overlapping columns"""

            var cols = [];
            if (uielements.length === 0) {
                return cols;
            }

            sorted_uiels = uielements.sort(function(a,b) { return a.layout.left - b.layout.left; });

            // # leftmost uiel must be in the row
            var current_col = {};
            current_col.uiels = [];

            cols.push(current_col);
            current_block = sorted_uiels.pop();
            current_col.uiels.push(current_block);
            current_col.margin_left = current_block.layout.left - leftOffset;

            // # iterate over the uiels left down
            sorted_uiels.forEach(function(u) {
                current_right = current_block.layout.left + current_block.layout.width;
                u_left = u.layout.left;
                u_right = u_left + u.layout.width;

                // # Two cases:
                // # 1. this block is in the current row.
                if (u_left < current_right) {
                    current_col.uiels.push(u);
                        // # a. this block is extends longer than the current block
                    if (u_right > current_right) current_block = u;
                }
                // # 2. this block must be the left-most block in a new row
                else {
                    current_col.width = current_right - current_col.uiels[0].layout.left;

                    current_col = {};
                    cols.push(current_col);

                    current_col.uiels.push(u);
                    current_col.margin_left = u_left - current_right;

                    current_block = u;
                }
            });
            // # set the width of the last column
            current_right = current_block.layout.left + current_block.layout.width;
            current_col.width = current_right - current_col.uiels[0].layout.left;

            return cols;
        }

        function split_to_rows(uielements, topOffset) {

            var rows = [];

            if (uielements.length === 0) {
                return rows;
            }

            var sorted_uiels = uielements.sort(function(a,b) { return b.layout.top - a.layout.top; });

            console.log(sorted_uiels);

            // topmost uiel must be in the row
            var current_row = {};
            rows.push(current_row);
            current_block = sorted_uiels.pop();

            current_row.uiels = (current_row.uiels || []);
            current_row.uiels.push(current_block);
            current_row.margin_top = current_block.layout.top - topOffset;

            // iterate over the uiels top down
            sorted_uiels.forEach(function(u) {

                current_bottom = current_block.layout.top + current_block.layout.height;
                u_top = u.layout.top;
                u_bottom = u_top + u.layout.height;

                // Two cases:
                // 1. this block is in the current row.
                if (u_top < current_bottom) {
                    current_row.uiels.push(u);
                        // # a. this block is extends longer than the current block
                    if (u_bottom > current_bottom) current_block = u;
                // 2. this block must be the top-most block in a new row
                }
                else {
                    var new_current_row = {};
                    new_current_row.uiels = [];
                    rows.push(new_current_row);

                    new_current_row.uiels.push(u);
                    new_current_row.margin_top = u_top - current_bottom;

                    current_row = new_current_row;
                    current_block = u;
                }
            });

            return rows;
        }

        function createTree(uielements, nmrRecursion, topOffset, leftOffset) {

            var rows = split_to_rows(uielements, topOffset);

            rows.forEach(function(row) {

                var columns = split_to_cols(row.uiels, leftOffset);
                row.cols = columns;

                var topOffset = 0;
                //(row.uiels[0].layout.top || 0);

                columns.forEach(function(column) {

                    var leftOffset = column.uiels[0].layout.left;
                    
                    if (column.uiels.length == 1) {
                        column.marginTop = (column.uiels[0].layout.top||0) - topOffset;
                        return;
                    }
                    else {
                        if (rows.length == 1 && columns.length == 1) {
                            // in this case, recursion will not terminate since input is not subdivided into smaller components
                            // create a relative container and absolute position the
                            // contents.
                            column.uiels[0].layout = (column.uiels[0].layout || {});

                            var min_top = (column.uiels[0].layout.top||0);
                            var max_bottom = (column.uiels[0].layout.top||0) + column.uiels[0].layout.height;
                            
                            column.uiels.forEach(function(uie) {
                                uie.layout = (uie.layout || {});
                                var top_offset = (uie.layout.top||0) - topOffset;
                                var left_offset = uie.layout.left - leftOffset;
                                uie.overlap_styles = "; position: absolute; top: %spx; left: %spx;" % (
                                    15 * top_offset, 80 * left_offset);
                                var min_top = Math.min(uie.layout.top, min_top);
                                var max_bottom = Math.max(uie.layout.top + uie.layout.height, max_bottom);
                            });

                            column.has_overlapping_nodes = true;

                            column.container_height = max_bottom - min_top;

                            column.tree = null;
                        }
                        else {
                            column.tree = createTree(column.uiel,s, topOffset, leftOffset, nmrRecursion+ 1);
                        }
                    }
                });
            });


            return { rows: rows };

        }

        var domTree = createTree(data, 0, 0, 0);

        /** RENDERING PART  **/

        function render_column(self) {
            // def absolutify(el, html):
            //     html.style_string += el.overlap_styles
            //     return html

            // def layoutify(el, html):
            //     html.class_string += ' hi%d span%d' % (el.layout.height, el.layout.width)
            //     return html

            // function add_padding(el, html) {
            //     if (el.layout.has_padding()) {
            //         html.style_string += "; padding: %dpx %dpx %dpx %dpx" % (
            //                 el.layout.t_padding, el.layout.r_padding, el.layout.b_padding, el.layout.l_padding)
                    
            //         return html;
            //     }
            // }

            function add_text_align(el, html) {
                if (el.layout.alignment != 'left') {
                    // create wrapper if not already wrapper
                    if (html.is_wrapper) {
                        wrapper = html;
                    }
                    else {
                        wrapper = Tag('div', {}, content=html);
                    }
                    wrapper.style_string += "; text-align: %s" % el.layout.alignment;
                    
                    return wrapper;
                }
                else {
                    return html;
                }
            }

            var html = "Yolo";
            if (self.has_overlapping_nodes) {
                // set position absolute, with pixel dimensions, all in the style attribute
                // htmls = [ el.html() for el in self.uiels ]
                // htmls = [ add_padding(el, layoutify(el, absolutify(el, add_text_align(el, html)))) for el, html in zip(self.uiels, htmls) ]

                // column_element = Tag('div', { 'class': self.class_string,
                //                            'style': self.style_string }, content=htmls)
            }
            else {
                el = self.uiels[0];
                html = el.html;
                //column_element = add_padding(el, layoutify(el, add_text_align(el, html)))
                //column_element.class_string += ' ' + self.class_string;
            }

            return html;
        }

        var cssLines = [];
        var jsLines = [];
        var htmlLines = [];

        var nodeLines = [];

        function rowLoop(rows) {
            domTree.rows.forEach(function(row) {
                if(row.cols) {
                    htmlLines.push('<div class="row">');

                    row.cols.forEach(function(col) {
                        if(col.tree) {
                            rowLoop(col.tree.rows);
                        }
                        else {
                            htmlLines.push(render_column(col));
                        }
                    });

                    htmlLines.push('</div>');
                }
            });
        }

        rowLoop(domTree.rows);

        // for (i = 0; i < data.length; i ++) {
        //     uie = data[i];
        //     if (uie.css) templateLines.push("<style>"+uie.css+"</style>");
        // }
        // for (i = 0; i < data.length; i ++) {
        //     uie = data[i];
        //     templateLines.push(uie.html);
        // }
        // for (i = 0; i < data.length; i ++) {
        //     uie = data[i];
        //     if (uie.js) templateLines.push('<script type="text/javascript">'+uie.js+'</script>');
        // }

        return htmlLines.join("\n");
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
        // CSS at the top, then HTML elements, then the corresponding Javascript at the bottom.
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

exports.generators = generators;
