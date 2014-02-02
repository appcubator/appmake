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
        typeahead: "../bower_components/typeahead.js/dist/typeahead"
    }
});

require([
    'jquery',
    'config',
    'backbone',
    'models/App',
    'views/Home',
    'views/Generator'
], function ($, config, Backbone, AppModel, HomeView, GeneratorView) {



    // Start the app, navigation and wall.
    var app = new AppModel();
    var homeView = new HomeView({ model: app, el: $('body')});
    var currentGeneratorView = new GeneratorView({ model: app, el: $('body')});

    var AppRouter = Backbone.Router.extend({ 
        routes: {
            "": "index",
            "generators/:pkg/:mdl/:gen": "generator"
        },
                        
        index: function() {
            homeView.render();
            homeView.setTypeahead();

        },
        generator: function(pkg, mdl, gen) {
            var uri = "generators/" + pkg + "/" + mdl + "/" + gen;
            $.ajax({
                url: uri,
                success: function(res){
                    console.log(res);
                    currentGeneratorView.render(res);
                }
            })           
        }
    });
    var appRouterInstance = new AppRouter();
    Backbone.history.start();

});
