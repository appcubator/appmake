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
            this.render();
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

            var newModuleName = $.trim($(this.$el.find('#newModuleNameInput')).val());
            if (newModuleName !== ""){
                console.log('Logging currentObject');


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
            console.log("Refreshing sidebar...");
            console.log(this.currentModule);
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
            console.log(state);
            var str = JST['app/scripts/templates/Sidebar.ejs'](state);

            console.log(str);
            this.$el.find('#pluginBrowser').html(str);

            console.log(str)
            $(this.$el.find("#moduleSelector")).dropdown();
        },
        loadAppstate: function(){
            $('#myModal').modal();
        }
    });

    return PluginEditorView;
});
