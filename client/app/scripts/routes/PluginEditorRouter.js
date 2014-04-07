/*global define*/

define([
    'jquery',
    'backbone',
    'views/PluginEditor'
], function ($, Backbone, PluginEditorView) {
    'use strict';

    var PluginEditorRouter = Backbone.Router.extend({
		routes: {
            "": "plugineditor",
            ":path": "plugineditor"
        },

        plugineditor: function(path) {
            this.pluginEditorView = new PluginEditorView({ model: app, el: $("body"), path: path, router: this});
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

    return PluginEditorRouter;
});
