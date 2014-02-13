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
            'click #createNewModuleButton': 'createNewModule'
        },
        initialize: function(){
            this.authenticated = false; 
            this.browsingLocalGenerators = true; 

            if (!this.authenticated){
                this.currentPlugin = "MyPlugin";
                this.currentModule = undefined;
                this.currentGenerator = undefined;
            }
            this.render();
        },
        render: function(){
        	this.$el.html(this.template({
                currentObject: this.model.get('currentObject'),
                plugins: {},
                authenticated: this.authenticated,
                currentPlugin: this.currentPlugin,
                currentModule: this.currentModule,
                currentGenerator: this.currentGenerator,
                browsingLocalGenerators: this.browsingLocalGenerators
            }));
            this.refreshSidebar();

			this.templateEditor = ace.edit('templateEditor');
            this.templateEditor.setTheme("ace/theme/textmate");

            // Detect the template mode (later)...
            // =this.templateEditor.getSession().setMode("aceDir/mode/javascript");
            this.codeEditor = ace.edit('codeEditor');
            this.codeEditor.setTheme("ace/theme/textmate");
            this.codeEditor.getSession().setMode("ace/mode/javascript"); 
        },
        createNewModule: function(event){
            console.log("Logging CURRENT OBJECT");
            console.log(this.model.get('currentObject'));

            event.stopPropagation();
            event.preventDefault(); 

            var gen = this.generators;
            var newModuleName = $.trim($(this.$el.find('#newModuleNameInput')).val());

            if (newModuleName !== ""){
                var currentObject = this.model.get('currentObject');
                if (this.browsingLocalGenerators){

                    console.log(currentObject);

                    currentObject.generators["MyPlugin"][newModuleName] = {};
                    this.browsingLocalGenerators = true;
                    this.currentPlugin = this.currentPlugin;
                    // Check if we're overriting the plugin after.
                    this.model.set('currentObject', currentObject);
                }
            }
            console.log("Logging CURRENT OBJECT");
            console.log(this.model.get('currentObject'));
            this.refreshSidebar();
        },
        refreshSidebar: function(){
            this.$el.find('#pluginBrowser').html(JST['app/scripts/templates/Sidebar.ejs']({
                currentObject: this.model.get('currentObject'),
                plugins: {},
                authenticated: this.authenticated,
                currentPlugin: this.currentPlugin,
                currentModule: this.currentModule,
                currentGenerator: this.currentGenerator,
                browsingLocalGenerators: this.browsingLocalGenerators
            }));
        },
        loadAppstate: function(){
            $('#myModal').modal();
        }
    });

    return PluginEditorView;
});
