var generators = [];
generators.push({
    name: 'flicksearchbar',
    version: '0.1',
    code: function(data, templates){
        // buttonText, searchID, galleryID
        var uie = {
            html: templates.html(data),
            css: '',
            js: templates.js(data)
        };
        return uie;
    },
    templates: {
        html:'<form id="<%= searchID %>">\n' +
               '<input type="text" name="q">\n' +
               '<input type="submit" value="<%= buttonText %>">\n' +
               '</form>',

        js:"function renderInList (e, d) {\
    if (e) alert(e);\
    else {\
        for (var i = 0; i < d.photos.photo.length; i ++) {\
            var photo = d.photos.photo[i];\
            $('#<%= galleryID %>').append('<img src=\"'+photo.url_q+'\">');\
        }\
    }\
}\
$('#<%= searchID %>').submit(function() {\
    var formData = $('#<%= searchID %>').serializeArray();\
    models.Picture.randomNFromFlickr(formData[0].value, 10, renderInList);\
    return false;\
});"
    }

});

generators.push({
    name: 'flickgallery',
    version: '0.1',
    code: function(data, templates){
        // galleryID
        var uie = {
            html:'<div id="'+data.galleryID+'"></div>',
            css: '',
            js: ''
        };
        return uie;
    },
    templates: {}
});
