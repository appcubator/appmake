/*global require*/

require.config({

    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        ace: {
            exports: 'ace'
        },
        "jquery-hotkeys": {
            exports: "$",
            deps: ['jquery']
        },
        Markdown: {
            exports: "Markdown",
            deps: ['MDConverter', 'MDSanitizer']
        },
        MDSanitizer: {
            deps: ['MDConverter']
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        'jquery-hotkeys': './jquery-hotkeys',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
	    bootstrap: '../bower_components/sass-bootstrap/dist/js/bootstrap',
        config: './config',
        ace: '../bower_components/ace-builds/src/ace',
        Markdown: '../bower_components/pagedown/Markdown.Editor',
        MDConverter: '../bower_components/pagedown/Markdown.Converter',
        MDSanitizer: '../bower_components/pagedown/Markdown.Sanitizer',
        'util': SITE_STATIC_URL + 'js/libs/util/util',
        "util.path": SITE_STATIC_URL + "js/libs/util/util.path",
        'app': SITE_STATIC_URL + 'js/application/main-app'
    }
});

require([
    'jquery',
    'config',
    'backbone',
    'routes/AppRouter',
    'models/App',
    'views/App',
    'app/Generator',
    'ace',
    'jquery-hotkeys',
    'util',
    'util.path'
],
function ($, config, Backbone, AppRouter, AppModel, AppView, Generator, ace, Markdown) {

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {

            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    $(function() {
        /* adds csrftoke to every ajax request we send */
        $.ajaxSetup({
            crossDomain: false, // obviates need for sameOrigin test
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type)) {
                    var token = getCookie('csrftoken');
                    xhr.setRequestHeader("X-CSRFToken", token);
                }
            }
        });
    });

    var AppRouter = new AppRouter();
    //window.G = new Generator(function(){ return appState.plugins; });


    Backbone.history.start();
});
