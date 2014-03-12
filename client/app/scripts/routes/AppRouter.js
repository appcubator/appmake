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
            "editor/:module/:pkg/:mdl": "module",
            ":path": "plugineditor"
            // "editor": "plugineditor",
            // "generators/:pkg/:mdl/:gen": "generator",
            // "package/:pkg": "pkg",
        },

        index: function() {
            console.log('Router initialized.');
            console.log(_.clone(appState));
        },

        plugineditor: function(path) {
            this.pluginEditorView = new PluginEditorView({ model: app, el: $("body"), path: path});
        },

        pkg: function (packageName){
            var uri = "package/" + pkg
            $.ajax({
                url: uri,
                success: function (res){
                    console.log(res);
                }
            })
        }
    });

    return AppRouter;
});
