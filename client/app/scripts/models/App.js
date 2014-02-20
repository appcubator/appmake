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

            if (!bone.currentPlugin && _.keys(bone.currentObject.plugins) ) {
                var pluginName = _.keys(bone.currentObject.plugins)[0];
                this.set('currentPlugin', pluginName);
            }


            if (!bone.currentModule && this.has('currentPlugin')) {
                var pluginModule = _.keys(bone.currentObject.plugins[pluginName])[0];
                this.set('currentModule', pluginModule);
            }

            if (!bone.currentModule && this.has('currentModule')) {
                var generator = bone.currentObject.plugins[pluginName][pluginModule][0];
                var generatorName = generator.name;
                this.set('currentGenerator', generatorName);
            }


            if (!bone.currentModule && this.has('currentGenerator') && _.keys(generator.templates)) {
                var templateName = _.keys(generator.templates)[0];
                this.set('currentTemplate', templateName);
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
