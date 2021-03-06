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
            browsingLocalGenerators: true,
            authenticated: false,
        },
        initialize: function(bone){

            // if (!bone.currentPlugin && _.keys(bone.currentObject.plugins)) {
            //     var pluginName = _.keys(bone.currentObject.plugins)[0];
            //     this.set('currentPlugin', pluginName);
            // }
			//
            // if(pluginName) {
            //     this.setupCurrentModule(bone);
            //     var metadata = this.get('currentObject').plugins[pluginName].metadata;
            //     this.get('currentObject').plugins[pluginName].metadata = metadata || {};
            // }
        },

        // setupCurrentModule: function(bone) {
		//
        //     var o = this.get('currentObject');
        //     var pluginName = this.get('currentPlugin');
		//
        //     if(!o.plugins[pluginName]) return;
		//
        //     if (!bone.currentModule && this.has('currentPlugin')) {
        //         var pluginModule = _.keys(o.plugins[pluginName])[0];
        //         this.set('currentModule', pluginModule);
        //     }
		//
        //     this.setupCurrentGenerator(bone);
        // },
		//
        // setupCurrentGenerator: function (bone) {
        //     var o = this.get('currentObject');
        //     var pluginModule = this.get('currentModule');
        //     var pluginName = this.get('currentPlugin');
		//
        //     if (!bone.currentModule && this.has('currentModule')) {
        //         var generator = o.plugins[pluginName][pluginModule][0];
        //         var generatorName = generator.name;
        //         this.set('currentGenerator', generatorName);
        //     }
		//
        //     this.setupCurrentTemplate(bone);
        // },
		//
        // setupCurrentTemplate: function(bone) {
		//
        //     var o = this.get('currentObject');
        //     var pluginName = this.get('currentPlugin');
        //     var pluginModule = this.get('currentModule');
		//
        //     if(!o.plugins[pluginName][pluginModule]) return;
		//
        //     var generator = o.plugins[pluginName][pluginModule][0];
		//
        //     if (!bone.currentModule && this.has('currentGenerator') && _.keys(generator.templates)) {
        //         var templateName = _.keys(generator.templates)[0];
        //         this.set('currentTemplate', templateName);
        //     }
		//
        // },

        // processList: function(genList){
        // 	var newGenList = _.map(genList, function (g){
        // 		g.tokens = [g.name, g.packageName, g.moduleName, g.version, "all"]
        // 		return g
        // 	});
        // 	this.set('generators', genList);
        // },
        // serialize: function(){
        //     var object = this.get('currentObject');
        //     console.log(JSON.stringify(object));
        //     return JSON.stringify(object);
        // }
    });

    return AppModel;
});
