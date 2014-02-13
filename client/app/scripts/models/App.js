/*global define*/

define([
	'jquery',
    'underscore',
    'backbone',
    'views/PluginEditor'
], function ($,_, Backbone, PluginEditorView) {
    'use strict';

    var AppModel = Backbone.Model.extend({
        defaults: {
        	currentObject: {
                generators: {},
                plugins: {}
            }
        },
        initialize: function(){
        	$.ajax({
        		url: "/generators/list",
        		success: function(res){
        			this.processList(res);
        		}.bind(this)
        	});
            this.pluginEditorView =  new PluginEditorView({ model: this, el: $('body') });
        },
        processList: function(genList){
        	var newGenList = _.map(genList, function (g){
        		g.tokens = [g.name, g.packageName, g.moduleName, g.version, "all"]
        		return g
        	});
        	this.set('generators', genList);
        }
    });

    return AppModel;
});
