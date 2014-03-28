var generators = [];

generators.push({
    name: 'design-header',
    version: '0.1',
    defaults: {
      className: '',
      style: '',
      content: 'Hello Header'
    },
    code: function(data, templates) {
        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<h1 class="<%= className %>" style="<%= style %>"><%= content %></h1>'
    },
    displayProps: {
        name: 'Header',
        iconType: 'header',
        halfWidth: true
    }
});

generators.push({
    name: 'design-text',
    version: '0.1',
    defaults: {
      className: '',
      style: '',
      content: 'Hello. This is a text sample. Lorem ipsum is too boring.'
    },
    code: function(data, templates) {
        /* expects: content, className, style */
        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<div class="<%= className %>" style="<%= style %>"><%= content %></div>'
    },
    displayProps: {
        name: 'Text',
        iconType: 'text',
        halfWidth: true
    }
});

generators.push({
    name: 'design-image',
    version: '0.1',
    defaults: {
      className: '',
      style: '',
      href: '#',
      src: 'https://i.istockimg.com/file_thumbview_approve/18120560/2/stock-photo-18120560-students-at-computer-class.jpg'
    },
    code: function(data, templates) {
        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<a href="<%= href %>"><img class="<%= className %>" style="<%= style %>" src="<%= src %>"></a>'
    },
    displayProps: {
        name: 'Image',
        iconType: 'image',
        halfWidth: true
    }
});

generators.push({
    name: 'design-link',
    version: '0.1',
    defaults: {
      className: '',
      style: '',
      href: '#',
      content: 'Click To Go'
    },
    code: function(data, templates) {
        /* expects: content, url, className, style */
        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<a href="<%= href %>" class="<%= className %>" style="<%= style %>"><%= content %></a>'
    },
    displayProps: {
        name: 'Link',
        iconType: 'link',
        halfWidth: true
    }
});

generators.push({
    name: 'design-button',
    version: '0.1',
    defaults: {
      className: '',
      style: '',
      href: '#',
      content: 'Button to Go'
    },
    code: function(data, templates) {
        /* expects: content, url, className, style */
        return { html: templates.html(data),
                 css: '',
                 js: '',
                 layout: data.layout };
    },
    templates: {
        html: '<a href="<%= href %>" class="btn <%= className %>" style="<%= style %>"><%= content %></a>'
    },
    displayProps: {
        name: 'Button',
        iconType: 'button',
        halfWidth: true
    }
});

generators.push({
    name: 'design-line',
    version: '0.1',
    defaults: {
      className: '',
      style: ''
    },
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
    },
    displayProps: {
        name: 'Line',
        iconType: 'line',
        halfWidth: true
    }
});

generators.push({
    name: 'design-box',
    version: '0.1',
    defaults: {
      className: '',
      style: ''
    },
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
    },
    displayProps: {
        name: 'Box',
        iconType: 'box',
        halfWidth: true
    }
});

generators.push({
    name: 'design-imageslider',
    version: '0.1',
    defaults: {
      cid: Math.floor(Math.random()*11),
      slides: [ {
        image: 'https://i.istockimg.com/file_thumbview_approve/18120560/2/stock-photo-18120560-students-at-computer-class.jpg',
        text : "Slide 1 Text"
      } ]
    },
    code: function(data, templates) {
        /* expects: content, url, className, style */
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
    },
    displayProps: {
        name: 'Image Slider',
        iconType: 'imageslider',
        halfWidth: true
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
    },
    displayProps: {
        name: 'FB Share',
        iconType: 'fbshare',
        halfWidth: true
    }
});

generators.push({
    name: 'design-embedvideo',
    version: '0.1',
    defaults: {
      youtubeURL: "http://www.youtube.com/watch?v=hZTx0vXUo34"
    },
    code: function(data, templates) {

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
        html: '<iframe class="video-embed" src="<%= url %>" width="<%= layout.width %>" height="<%= layout.height %>" frameborder="0"></iframe>'
    },
    displayProps: {
        name: 'Embed Video',
        iconType: 'embedvideo',
        halfWidth: true
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
    templates: { },
    displayProps: {
        name: 'Custom Widget',
        iconType: 'custom-widget',
        halfWidth: true
    }
});

generators.push({
    name: 'form-field',
    version: '0.1',
    defaults: {
      field_name: "",
      displayType: "single-line-text"
    },
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
        "image-uploader": '<div class="upload-image btn">Upload Image</div><input type="hidden" name="<%= field_name %>',
        "file-uploader": '<div class="upload-file btn">Upload File</div>',
        "date-picker": '<input name="<%= field_name %>" type="text" placeholder="<%= placeholder %>"><img style="margin-left:5px;" src="/static/img/calendar-icon.png">'
    },
    displayProps: {
        name: 'Form Field',
        halfWidth: true
    }
});

exports.generators = generators;
