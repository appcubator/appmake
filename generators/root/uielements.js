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
    name: 'design-header',
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

generators.push({
    name: 'design-text',
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
        html: '<p class="<%= className %>" style="<%= style %>"><%= content %></p>'
    }
});

generators.push({
    name: 'design-image',
    version: '0.1',
    code: function(data, templates) {
        /* expects: url, className, style */
        data.className = data.className || '';
        data.style = data.style || '';
        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<img class="<%= className %>" style="<%= style %>" src="<%= url %>">'
    }
});

generators.push({
    name: 'design-link',
    version: '0.1',
    code: function(data, templates) {
        /* expects: content, url, className, style */
        data.className = data.className || '';
        data.style = data.style || '';
        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<a href="<%= url %>" class="<%= className %>" style="<%= style %>"><%= content %></a>'
    }
});

generators.push({
    name: 'design-button',
    version: '0.1',
    code: function(data, templates) {
        /* expects: content, url, className, style */
        data.className = data.className || '';
        data.style = data.style || '';
        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<a href="<%= url %>" class="btn <%= className %>" style="<%= style %>"><%= content %></a>'
    }
});

generators.push({
    name: 'design-line',
    version: '0.1',
    code: function(data, templates) {
        /* expects: className, style */
        data.className = data.className || '';
        data.style = data.style || '';
        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<hr class="<%= className %>" style="<%= style %>">'
    }
});

generators.push({
    name: 'design-box',
    version: '0.1',
    code: function(data, templates) {
        /* expects: content, url, className, style */
        data.className = data.className || '';
        data.style = data.style || '';
        data.style += " width: 100%; height: 100%;";
        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<div class="<%= className %>" style="<%= style %>"></div>'
    }
});

/** NOT IMPLEMENTED YET **/

generators.push({
    name: 'design-imageslider',
    version: '0.1',
    code: function(data, templates) {
        /* expects: content, url, className, style */
        data.className = data.className || '';
        data.style = data.style || '';
        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<a href="<%= url %>" class="<%= className %>" style="<%= style %>"><%= content %></a>'
    }
});

generators.push({
    name: 'design-fbshare',
    version: '0.1',
    code: function(data, templates) {
        /* expects: content, url, className, style */
        data.className = data.className || '';
        data.style = data.style || '';
        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<a href="<%= url %>" class="<%= className %>" style="<%= style %>"><%= content %></a>'
    }
});

generators.push({
    name: 'design-embedvideo',
    version: '0.1',
    code: function(data, templates) {
        /* expects: content, url, className, style */
        data.className = data.className || '';
        data.style = data.style || '';
        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<a href="<%= url %>" class="<%= className %>" style="<%= style %>"><%= content %></a>'
    }
});


exports.generators = generators;
