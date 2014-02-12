/*global require*/
'use strict';

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
        typeahead: {
            deps: ['jquery'],
            exports: '$.fn.typeahead'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: '../bower_components/sass-bootstrap/dist/js/bootstrap',
        config: './config',
        typeahead: "../bower_components/typeahead.js/dist/typeahead",
        aceDir: '../bower_components/ace/lib/ace',
        ace: '../bower_components/ace/lib/ace/ace'
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

    var app = new AppModel();
    var AppView = new AppView({ model: app, el: $('body')});
    var AppRouter = new AppRouter();
    AppRouter.appView = AppView;

    Backbone.history.start();
});
