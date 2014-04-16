/*global define*/

define([
    'jquery',
    'backbone',
    'views/Home'
], function ($, Backbone, HomeView) {
    'use strict';

    var AppRouter = Backbone.Router.extend({
		routes: {
            "": "index",
        },

        index: function() {
            console.log('Router initialized.');
            new HomeView({ el: $('#home') });
        },
    });

    return AppRouter;
});
