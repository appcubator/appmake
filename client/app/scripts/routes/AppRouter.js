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
            "editor": "plugineditor",
            "generators/:pkg/:mdl/:gen": "generator",
            "package/:pkg": "pkg",
            "module/:pkg/:mdl": "module"
        },

        index: function() {
            console.log('Router initialized.');
            console.log(_.clone(appState));

        },

        plugineditor: function() {
            console.log(_.clone(appState));

            this.pluginEditorView = new PluginEditorView({ model: app, el: $("body")});
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
