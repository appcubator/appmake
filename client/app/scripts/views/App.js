/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/PluginEditor'
], function ($, _, Backbone, JST, PluginEditorView) {
    'use strict';
    var AppView = Backbone.View.extend({
        template: JST['app/scripts/templates/App.ejs'],
        events: {
            "click .startPluginEditorButton": "startPluginEditor"
        },
        render: function(){
        	var result = this.template({});
        	this.$el.html( result );
        },
        initialize: function(options){
            this.render();
            this.router = options.router;
        },
        startPluginEditor: function(){
            //this.pluginEditorView = new PluginEditorView({ model: this.model, el: $("body")});
            this.router.navigate('/editor');
        }
    });

    return AppView;
});
