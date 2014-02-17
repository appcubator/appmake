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
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
	bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
        config: './config',
        ace: '../bower_components/ace-builds/src/ace'
    }
});

require([
    'jquery',
    'config',
    'backbone',
    'routes/AppRouter',
    'models/App',
    'views/App',
    'ace'
], function ($, config, Backbone, AppRouter, AppModel, AppView, ace) {

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

    app = new AppModel({ currentObject: appState });
    console.log(app);
    var AppRouter = new AppRouter();
    var AppView = new AppView({ model: app, el: $('body'), router: AppRouter});
    AppRouter.appView = AppView;

    Backbone.history.start();
});
