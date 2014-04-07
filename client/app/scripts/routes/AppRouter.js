/*global define*/

define([
    'jquery',
    'backbone',
    'views/PluginEditor'
], function ($, Backbone, PluginEditorView) {
    'use strict';

    var AppRouter = Backbone.Router.extend({
		routes: {
            "": "index",
        },

        index: function() {
            console.log('Router initialized.');
            console.log(_.clone(appState));
        },
    });

    return AppRouter;
});
