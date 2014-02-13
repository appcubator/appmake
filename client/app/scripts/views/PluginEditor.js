/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'ace',
    'bootstrap',
], function ($, _, Backbone,  JST, ace) {
    'use strict';
    var PluginEditorView = Backbone.View.extend({
        template: JST['app/scripts/templates/PluginEditor.ejs'],
        events: {
            'click #loadButton': 'loadAppstate',
            'click #saveButton': 'saveAppstate',
            'click #previewButton': 'previewGenerator',
            'click #publishButton': 'publishPlugin',
            'click #createNewModuleButton': 'createNewModule',
            'click #createNewGeneratorButton': 'createNewGenerator',
            'click .selectModuleButton': 'moduleSelected',
            'click .selectGeneratorButton': 'generatorSelected',
            'click .selectTemplateButton': 'templateSelected',
            'click #createNewTemplateButton': 'createNewTemplate',
        },
        initialize: function(){
            this.render();


            this.model.on("change:currentPlugin", this.render, this); 
            this.model.on("change:currentModule", this.render, this); 
            this.model.on("change:currentGenerator", this.render, this); 
            this.model.on("change:currentTemplate", this.render, this); 


        },
        render: function(){
        	this.$el.html(this.template({
                app: {
                    currentObject: this.model.get('currentObject'),
                    authenticated: this.model.get('authenticated'),
                    currentPlugin: this.model.get('currentPlugin'),
                    currentModule: this.model.get('currentModule'),
                    currentGenerator: this.model.get('currentGenerator'),
                    currentTemplate: this.model.get('currentTemplate'),                    
                    browsingLocalGenerators: this.model.get('browsingLocalGenerators')                    
                }
            }));

            this.templateEditor = ace.edit('templateEditor');
            this.templateEditor.setTheme("ace/theme/textmate");

            // Detect the template mode (later)...
            // =this.templateEditor.getSession().setMode("aceDir/mode/javascript");
            this.codeEditor = ace.edit('codeEditor');
            this.codeEditor.setTheme("ace/theme/textmate");
            this.codeEditor.getSession().setMode("ace/mode/javascript");

            this.refreshSidebar();
        },
        createNewTemplate: function(event){
            event.stopPropagation();
            event.preventDefault();

            console.log("create template");
             var newTemplateName = $.trim($(this.$el.find('#newTemplateNameInput')).val());
             var pluginName = this.model.get('currentPlugin');
             var mdlName = this.model.get('currentModule');
             var genName = this.model.get('currentGenerator');
             var obj = this.model.get('currentObject');
             if (newTemplateName !== "" && mdlName !== undefined && pluginName !== undefined && genName !== undefined){
                if (this.model.get('browsingLocalGenerators')){
                    var o = obj.generators[pluginName][mdlName];
                } else {
                    var o = obj.plugins[pluginName][mdlName];
                }
                for (var i = 0; i < o.length; i++){
                    if (o[i].name === genName){
                        console.log(o[i]);
                        o[i].templates[newTemplateName] = "";
                        this.model.set('currentTemplate', newTemplateName);
                        break;
                    }
                }
                this.model.set('currentObject', obj);
                console.log(this.model.get('currentObject'));
            }
        },

        createNewGenerator: function(event){
            event.stopPropagation();
            event.preventDefault();

            console.log("create generators");
            var newGeneratorName = $.trim($(this.$el.find('#newGeneratorNameInput')).val());
            if (newGeneratorName !== "" && this.model.get('currentModule') !== undefined){
                if (this.model.get('browsingLocalGenerators')){
                    var o = this.model.get('currentObject');
                    var newGenerator = {
                        "templates": {},
                        "code": "",
                        "version": "0.1",
                        "name": newGeneratorName
                    }
                    o.generators[this.model.get('currentPlugin')][this.model.get('currentModule')].push(newGenerator);
                    // Check if we're overriting the plugin after.
                    this.model.set('currentObject', o);
                } // handle the else case later
                this.model.set('currentGenerator', newGeneratorName);
            }
            this.refreshSidebar();
        },
        createNewModule: function(event){
            event.stopPropagation();
            event.preventDefault(); 

            var newModuleName = $.trim($(this.$el.find('#newModuleNameInput')).val());
            if (newModuleName !== ""){
                if (this.model.get('browsingLocalGenerators')){
                    var o = this.model.get('currentObject');
                    o.generators[this.model.get('currentPlugin')][newModuleName] = [];
                    // Check if we're overriting the plugin after.
                    this.model.set('currentObject', o);
                }
                this.model.set('currentModule', newModuleName);
            }
            this.refreshSidebar();
        },

        refreshSidebar: function(){
            var state = {
                app: {
                    currentObject: this.model.get('currentObject'),
                    authenticated: this.model.get('authenticated'),
                    currentPlugin: this.model.get('currentPlugin'),
                    currentModule: this.model.get('currentModule'),
                    currentGenerator: this.model.get('currentGenerator'),
                    currentTemplate: this.model.get('currentTemplate'),
                    browsingLocalGenerators: this.model.get('browsingLocalGenerators')                    
                }
            };


            var str = JST['app/scripts/templates/Sidebar.ejs'](state);
            this.$el.find('#pluginBrowser').html(str);
            $(this.$el.find("#moduleSelector")).dropdown();
        },

        moduleSelected: function(event){
            var moduleName = $($(event.target).closest('.selectModuleButton')).attr('modulename');
            this.model.set('currentModule', moduleName);
            console.log(this.model.get('currentModule'));
        },
        generatorSelected: function(event){
            var generatorName = $($(event.target).closest('.selectGeneratorButton')).attr('generatorname');
            this.model.set('currentGenerator', generatorName);
            console.log(this.model.get('currentGenerator'));            
        },
        templateSelected: function (event){
            var templateName = $($(event.target).closest('.selectTemplateButton')).attr('templatename');
            this.model.set('currentTemplate', templateName);
            console.log(this.model.get('currentTemplate'));              
        },
        loadAppstate: function(){
            $('#myModal').modal();
        }
    });

    return PluginEditorView;
});
