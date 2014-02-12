/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'bootstrap'
], function ($, _, Backbone,  JST) {
    'use strict';
    var ace = require('ace');
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
            this.browsingLocalGenerators = false; 

            if (!this.authenticated){
                this.currentPlugin = undefined;
                this.currentModule = undefined;
                this.currentGenerator = undefined;
            }
            this.render();
        },
        render: function(){
        	this.$el.html(this.template({
                currentObject: this.currentObject,
                plugins: {},
                authenticated: this.authenticated,
                currentPlugin: this.currentPlugin,
                currentModule: this.currentModule,
                currentGenerator: this.currentGenerator,
                browsingLocalGenerators: this.browsingLocalGenerators
            }));
            this.refreshSidebar();

			this.templateEditor = ace.edit('templateEditor');
            this.templateEditor.setTheme("aceDir/theme/textmate");

            // Detect the template mode (later)...
            // =this.templateEditor.getSession().setMode("aceDir/mode/javascript");
            this.codeEditor = ace.edit('codeEditor');
            this.codeEditor.setTheme("aceDir/theme/textmate");
            this.codeEditor.getSession().setMode("aceDir/mode/javascript"); 
        },
        createNewModule: function(event){

            event.stopPropagation();
            event.preventDefault(); 

            var gen = this.generators;
            var newModuleName = $.trim($(this.$el.find('#newModuleNameInput')).val());

            if (newModuleName !== ""){
                var currentObject = this.model.get('currentObject');
                if (this.currentPlugin === undefined){
                    var randomPluginName = "MyPlugin";
                    currentObject.generators[randomPluginName] = {}; 
                    currentObject.generators[randomPluginName][newModuleName] = {};
                    this.browsingLocalGenerators = true;
                    this.currentPlugin = randomPluginName;

                    this.model.set('currentObject', currentObject);
                }
            }
            this.refreshSidebar();
        },
        refreshSidebar: function(){
            this.$el.find('#pluginBrowser').html(JST['app/scripts/templates/Sidebar.ejs']({
                currentObject: this.currentObject,
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
