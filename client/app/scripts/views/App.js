/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'typeahead',
    'views/PluginEditor'
], function ($, _, Backbone, JST, typeahead, PluginEditorView) {
    'use strict';


    var AppView = Backbone.View.extend({
        template: JST['app/scripts/templates/App.ejs'],
        defaults: {
            currentObject: {}
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
            this.model.on('change:generators', this.setTypeahead, this);
        },
        setTypeahead: function(){
            var generators = this.model.get('generators'); 
            $('input#repoSearchInput').typeahead({
                name: 'generators',
                local: generators,
                valueKey: 'name',
                template: JST['app/scripts/templates/Gen.ejs'],
                limit: 10000
            });
        },
        startPluginEditor: function(){
            this.pluginEditorView = new PluginEditorView({ model: this.model, el: $("body")});
        }
    });

    return AppView;
});
