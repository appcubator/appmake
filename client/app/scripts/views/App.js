/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/PluginEditor'
], function ($, _, Backbone, JST, PluginEditorView) {
    'use strict';

    var defaultObject = {
        "generators": {
            "MyPlugin": {}
        },
        "plugins": {}
    }

    var AppView = Backbone.View.extend({
        template: JST['app/scripts/templates/App.ejs'],
        defaults: {
            currentObject: defaultObject
        },
        events: {
            "click .startPluginEditorButton": "startPluginEditor"
        },
        render: function(){
        	var result = this.template({});
        	this.$el.html( result );
        },
        initialize: function(){
            this.render();
        },
        startPluginEditor: function(){
            this.pluginEditorView = new PluginEditorView({ model: this.model, el: $("body")});
        }
    });

    return AppView;
});
