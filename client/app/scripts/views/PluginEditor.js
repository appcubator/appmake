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

            event.stopPropagation();
            event.preventDefault(); 

            var gen = this.generators;
            var newModuleName = $.trim($(this.$el.find('#newModuleNameInput')).val());

            if (newModuleName !== ""){
                var currentObject = this.model.get('currentObject');
                if (this.browsingLocalGenerators){


                    currentObject.generators["MyPlugin"][newModuleName] = {};
                    this.browsingLocalGenerators = true;
                    this.currentPlugin = this.currentPlugin;
                    this.currentModule = newModuleName;

                    // Check if we're overriting the plugin after.
                    this.model.set('currentObject', currentObject);

                }
            }
            this.refreshSidebar();
        },
        refreshSidebar: function(){
            console.log("Refreshing sidebar...");
            var currentObject = this.model.get('currentObject');
            console.log(currentObject);

            var str = JST['app/scripts/templates/Sidebar.ejs']({
                currentObject: currentObject,
                plugins: {},
                authenticated: this.authenticated,
                currentPlugin: this.currentPlugin,
                currentModule: this.currentModule,
                currentGenerator: this.currentGenerator,
                browsingLocalGenerators: this.browsingLocalGenerators
            });
            this.$el.find('#pluginBrowser').html(str);
            $(this.$el.find("#moduleSelector")).dropdown();
        },
        loadAppstate: function(){
            $('#myModal').modal();
        }
    });

    return PluginEditorView;
});
