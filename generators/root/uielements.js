var generators = [];

generators.push({
    name: 'node',
    version: '0.1',
    code: function(data, templates) {
        /* data has isSingle, tagName, idString, classList, styleString, attribs, content */
        if (data.classList)
            data.classString = data.classList.join(' ');
        return { html: templates.html({data: data}),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<<%= data.tagName %>'+
                '<% if (data.idString) { %> id="<%= data.idString %>"<% } %>'+
                '<% if (data.classString) { %> class="<%= data.classString %>"<% } %>'+
                '<% if (data.styleString) { %> style="<%= data.styleString %>"<% } %>'+
                '<% for (var attrib in data.attribs) { %> <%= attrib %>="<%= data.attribs[attrib] %>"<% } %>'+
                '><% if (!data.isSingle) { %>'+
                 '<% if (data.content) { %>'+
                     '\n<%- data.content %>\n'+
                 '<% } %>'+
              '</<%= data.tagName %>>'+
              '<% } %>'
    }
});


generators.push({
    name: 'design.header',
    version: '0.1',
    code: function(data, templates) {
        /* expects: content, className, style */
        data.className = data.className || '';
        data.style = data.style || '';
        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<h1 class="<%= className %>" style="<%= style %>"><%= content %></h1>'
    }
});

exports.generators = generators;
