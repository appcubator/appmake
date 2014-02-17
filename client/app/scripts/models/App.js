/*global define*/

define([
	'jquery',
    'underscore',
    'backbone',
    'views/PluginEditor'
], function ($,_, Backbone, PluginEditorView) {
    'use strict';
    var defaultObject = {
        generators: {
            "MyPlugin": {}
        },
        plugins: {}
    }
    var AppModel = Backbone.Model.extend({
        defaults: {
            browsingLocalGenerators: true,
            authenticated: false,            
        },
        initialize: function(bone){

            if (!bone.currentPlugin && _.keys(bone.currentObject.generators) ) {
                this.set('currentPlugin', _.keys(bone.currentObject.generators)[0]);
            }


            if (!bone.currentModule && this.has('currentPlugin')) {
                var pluginName = this.get('currentPlugin');
                var pluginModule = _.keys(bone.currentObject.generators[pluginName])[0];
                this.set('currentModule', pluginModule);
            }

        },
        processList: function(genList){
        	var newGenList = _.map(genList, function (g){
        		g.tokens = [g.name, g.packageName, g.moduleName, g.version, "all"]
        		return g
        	});
        	this.set('generators', genList);
        },
        serialize: function(){
            var object = this.get('currentObject');
            console.log(JSON.stringify(object));
            return JSON.stringify(object);
        }
    });

    return AppModel;
});
