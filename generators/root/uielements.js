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
        data.href = data.href || "#";

        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<a href="<%= href %>"><img class="<%= className %>" style="<%= style %>" src="<%= src %>"></a>'
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
        html: '<a href="<%= href %>" class="<%= className %>" style="<%= style %>"><%= content %></a>'
    }
});

generators.push({
    name: 'design-button',
    version: '0.1',
    code: function(data, templates) {
        /* expects: content, url, className, style */
        data.className = data.className || '';
        data.style = data.style || '';
        data.href = data.href || '#';

        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<a href="<%= href %>" class="btn <%= className %>" style="<%= style %>"><%= content %></a>'
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

generators.push({
    name: 'design-imageslider',
    version: '0.1',
    code: function(data, templates) {
        /* expects: content, url, className, style */
        data.cid = Math.floor(Math.random()*11);
        data.slides = data.slides || [];
        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html:   ['<div id="slider-<%= cid %>" class="carousel slide">',
        '<ol class="carousel-indicators">',
          '<% for(var i=0; i < slides.length; i++) { %>',
          '<li data-target="#slider-<%= cid %>" data-slide-to="<%= i %>" <% if(i==0) { %>class="active" <% } %>></li>',
          '<% } %>',
        '</ol>',
        '<!-- Carousel items -->',
        '<div class="carousel-inner">',
          '<% _(slides).each(function(slide, index) { %>',
            '<div class="<% if(index == 0) { %>active <% } %>item">',
              '<img src="<%= slide.image %>">',
              '<div class="carousel-caption"><p><%= slide.text %></p></div>',
            '</div>',
          '<% }); %>',
        '</div>',
        '<!-- Carousel nav -->',
        '<a class="carousel-control left" href="#slider-<%= cid %>" data-slide="prev">&lsaquo;</a>',
        '<a class="carousel-control right" href="#slider-<%= cid %>" data-slide="next">&rsaquo;</a>',
      '</div>'].join('\n')
    }
});

generators.push({
    name: 'design-fbshare',
    version: '0.1',
    code: function(data, templates) {
        /* expects: content, url, className, style */
        var obj = {};
        
        if (data.pageLink) {
            obj = { html: templates.htmlForPage(data),
                    css: '',
                    js: '',
                    layout: data.layout };

        }
        else {
            obj = { html: templates.htmlForCurrentPage(data),
                    css: '',
                    js: '',
                    layout: data.layout };
        }

        return obj;
    },
    templates: {
        htmlForCurrentPage: [
                        '<div class="fb-like" data-href="" ',
                        'data-width="<%= layout.width * 80 %>" data-send="true" ',
                        'data-show-faces="false" onload="this.dataset.href=window.location.href;"></div>'
                     ].join(''),
        htmlForPage: [
                        '<div class="fb-like-box" data-href="<%= pageLink %>" ',
                        'data-width="<%= layout.width * 80 %>" data-height="<%= layout.height * 15>" ',
                        'data-show-faces="false" data-header="false" data-stream="false" data-show-border="false"></div>'
                     ].join('')
    }
});

generators.push({
    name: 'design-embedvideo',
    version: '0.1',
    code: function(data, templates) {
        /* expects: content, url, className, style */
        var url = data.youtubeURL;
        url = url.replace('http://www.youtube.com/watch?v=', '');
        url = '//www.youtube.com/embed/' + url;

        data.url = url;

        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<iframe class="video-embed" src="<%= url %>" width="<%= layout.width * 80 %>" height="<%= layout.height * 15 %>" frameborder="0"></iframe>'
    }
});

generators.push({
    name: 'design-custom',
    version: '0.1',
    code: function(data, templates) {
        /* expects: content, url, className, style */
        return { html: data.htmlC,
                 css: data.cssC,
                 js: data.jsC,
                 layout: data.layout };
    },
    templates: { }
});

exports.generators = generators;
