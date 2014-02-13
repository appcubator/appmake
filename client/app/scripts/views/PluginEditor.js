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
            'click .selectModuleButton': 'moduleSelected'
        },
        initialize: function(){
            this.render();



            this.model.on("change:currentPlugin", this.render, this); 
            this.model.on("change:currentModule", this.render, this); 

        },
        render: function(){
        	this.$el.html(this.template({
                app: {
                    currentObject: this.model.get('currentObject'),
                    authenticated: this.model.get('authenticated'),
                    currentPlugin: this.model.get('currentPlugin'),
                    currentModule: this.model.get('currentModule'),
                    currentGenerator: this.model.get('currentGenerator'),
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
        createNewModule: function(event){
            event.stopPropagation();
            event.preventDefault(); 

            var newModuleName = $.trim($(this.$el.find('#newModuleNameInput')).val());
            if (newModuleName !== ""){
                if (this.model.get('browsingLocalGenerators')){
                    var o = this.model.get('currentObject');
                    o.generators[this.model.get('currentPlugin')][newModuleName] = {};
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
        loadAppstate: function(){
            $('#myModal').modal();
        }
    });

    return PluginEditorView;
});
