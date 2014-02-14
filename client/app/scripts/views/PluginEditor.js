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
            'click #downloadButton': 'downloadJSON',
            'click #createNewModuleButton': 'createNewModule',
            'click #createNewGeneratorButton': 'createNewGenerator',
            'click .selectModuleButton': 'moduleSelected',
            'click .selectGeneratorButton': 'generatorSelected',
            'click .selectTemplateButton': 'templateSelected',
            'click #createNewTemplateButton': 'createNewTemplate'
        },
        initialize: function(){
            this.model.on("change:currentPlugin", this.render, this); 
            this.model.on("change:currentModule", this.render, this); 
            this.model.on("change:currentGenerator", this.render, this); 
            this.model.on("change:currentTemplate", this.render, this);

            this.render();

            //setInterval(this.saveAppstate.bind(this), 5000);

        },
        render: function(){
            var app =  {
                    currentObject: this.model.get('currentObject'),
                    authenticated: this.model.get('authenticated'),
                    currentPlugin: this.model.get('currentPlugin'),
                    currentModule: this.model.get('currentModule'),
                    currentGenerator: this.model.get('currentGenerator'),
                    currentTemplate: this.model.get('currentTemplate'),                    
                    browsingLocalGenerators: this.model.get('browsingLocalGenerators')                    
            }
        	this.$el.html(this.template({ app: app }));
            this.templateEditor = ace.edit('templateEditor');
            this.templateEditor.setTheme("ace/theme/textmate");

            // Detect the template mode (later)...
            // =this.templateEditor.getSession().setMode("aceDir/mode/javascript");
            this.codeEditor = ace.edit('codeEditor');
            this.codeEditor.setTheme("ace/theme/textmate");
            this.codeEditor.getSession().setMode("ace/mode/javascript");

            this.setCodeEditor();
            this.setTemplateEditor();


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
            this.setTemplateEditor();
            this.setCodeEditor();

            this.render();
        },
        downloadJSON: function(event){
            var modal = $('#downloadModal').modal();
            var o = this.model.serialize();
            $(modal).find('#downloadEditor').text(o);
        },
        createNewGenerator: function(event){
            event.stopPropagation();
            event.preventDefault();

            console.log("create generators");
            var newGeneratorName = $.trim($(this.$el.find('#newGeneratorNameInput')).val());
            if (newGeneratorName !== "" && this.model.get('currentModule') !== undefined){
                if (this.model.get('browsingLocalGenerators')){
                    var code = "//example " + Math.random().toString().slice(3, 5);
                    var o = this.model.get('currentObject');
                    var newGenerator = {
                        "templates": {},
                        "code": code,
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
            this.setCodeEditor();
        },
        generatorSelected: function(event){
            var generatorName = $($(event.target).closest('.selectGeneratorButton')).attr('generatorname');
            this.model.set('currentGenerator', generatorName);
            this.setCodeEditor();
        },
        templateSelected: function (event){
            var templateName = $($(event.target).closest('.selectTemplateButton')).attr('templatename');
            this.model.set('currentTemplate', templateName);
            this.setCodeEditor();
            this.setTemplateEditor();
        },
        setTemplateEditor: function(){
            var currentObject = this.model.get('currentObject');
            var pluginName = this.model.get('currentPlugin');
            var mdlName = this.model.get('currentModule');
            var genName = this.model.get('currentGenerator');
            var tmpName = this.model.get('currentTemplate');
            if (currentObject !== undefined && pluginName !== undefined 
                && mdlName !== undefined && genName !== undefined && tmpName !== undefined){
                var mdl = this.getCurrentPluginList()[pluginName][mdlName];
                var gen = this.findGenByName(mdl, genName);
                if (gen !== undefined){
                    var tmp = gen.templates[tmpName];
                    this.templateEditor.setValue(tmp);
                }
            }            
        },
        saveTemplateEditor: function(){
            console.log("Saving templates...")
            var currentObject = this.model.get('currentObject');
            var pluginName = this.model.get('currentPlugin');
            var mdlName = this.model.get('currentModule');
            var genName = this.model.get('currentGenerator');
            var tmpName = this.model.get('currentTemplate');

            if (currentObject !== undefined && pluginName !== undefined 
                && mdlName !== undefined && genName !== undefined && tmpName !== undefined){
                console.log('all defined');
                if (this.model.get('browsingLocalGenerators')){
                    var gens = currentObject.generators[pluginName][mdlName];
                    console.log(gens);
                    console.log(genName);
                    for (var i = 0; i < gens.length; i++){
                        if (gens[i].name === this.model.get('currentGenerator')) {
                            gens[i].templates[tmpName] = this.templateEditor.getValue();
                        }   
                    }
                    console.log(currentObject);
                    this.model.set('currentObject', currentObject)
                }
            }
        },
        setCodeEditor: function(){
            var currentObject = this.model.get('currentObject');
            var pluginName = this.model.get('currentPlugin');
            var mdlName = this.model.get('currentModule');
            var genName = this.model.get('currentGenerator');
            if (currentObject !== undefined && pluginName !== undefined 
                && mdlName !== undefined && genName !== undefined){
                var mdl = this.getCurrentPluginList()[pluginName][mdlName];
                var gen = this.findGenByName(mdl, genName);
                if (gen !== undefined){
                    this.codeEditor.setValue(gen.code);
                }
            }
        },
        saveCodeEditor: function(){
            console.log("Saving code...")
            var currentObject = this.model.get('currentObject');
            var pluginName = this.model.get('currentPlugin');
            var mdlName = this.model.get('currentModule');
            var genName = this.model.get('currentGenerator');

            if (currentObject !== undefined && pluginName !== undefined 
                && mdlName !== undefined && genName !== undefined){
                console.log('all defined');
                if (this.model.get('browsingLocalGenerators')){
                    var gens = currentObject.generators[pluginName][mdlName];
                    console.log('Browsing local..gens: ');
                    console.log(gens);
                    console.log(genName);
                    for (var i = 0; i < gens.length; i++){
                        if (gens[i].name === this.model.get('currentGenerator')) {
                            gens[i].code = this.codeEditor.getValue();
                        }   
                    }
                    console.log(currentObject);
                    this.model.set('currentObject', currentObject)
                }
            }
        },
        findGenByName: function(module, genName){
            for (var i = 0; i < module.length; i++){
                if (genName === module[i].name){
                    return module[i];
                }
            }
        },
        getCurrentPluginList: function(){
            if (this.model.get('browsingLocalGenerators')){
                return (this.model.get('currentObject').generators);
            } else {
                return (this.model.get('currentObject').plugins);
            }
        },                
        loadAppstate: function(){
            $('#loadModal').modal();
        },
        saveAppstate: function(){
            this.saveTemplateEditor();
            this.saveCodeEditor();  
        }
    });

    return PluginEditorView;
});