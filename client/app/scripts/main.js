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
        ace: {
            exports: 'ace'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: '../bower_components/sass-bootstrap/dist/js/bootstrap',
        config: './config',
        ace: '../bower_components/ace-builds/src/ace',
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

    var app = new AppModel({ currentObject: {
        plugins: {},
        generators: {
            MyPlugin: {}
        }     
    }});
    
    var AppView = new AppView({ model: app, el: $('body')});
    var AppRouter = new AppRouter();
    AppRouter.appView = AppView;

    Backbone.history.start();
});
