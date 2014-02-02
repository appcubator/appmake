/*global define*/

define([
	'jquery',
    'underscore',
    'backbone'
], function ($,_, Backbone) {
    'use strict';

    var AppModel = Backbone.Model.extend({
        defaults: {
        	generators: undefined
        },
        initialize: function(){
        	$.ajax({
        		url: "/generators/list",
        		success: function(res){
        			this.processList(res);
        		}.bind(this)
        	})
        },
        processList: function(genList){
        	var newGenList = _.map(genList, function (g){
        		g.tokens = [g.name, g.packageName, g.moduleName, g.version]
        		return g
        	});
        	this.set('generators', genList);
        },

    });

    return AppModel;
});
