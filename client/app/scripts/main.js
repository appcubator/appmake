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

    app = new AppModel({ currentObject: appState });
    console.log(app);
    var AppRouter = new AppRouter();
    var AppView = new AppView({ model: app, el: $('body'), router: AppRouter});
    AppRouter.appView = AppView;

    Backbone.history.start();
});
