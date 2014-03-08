/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'ace',
    'bootstrap',
], function ($, _, Backbone,  JST) {
    'use strict';
    var PluginEditorView = Backbone.View.extend({

        template: JST['app/scripts/templates/PluginEditor.ejs'],

        events: {
            'click #loadButton': 'loadAppstate',
            'click #saveButton': 'saveAppstate',
            'click #previewButton': 'previewGenerator',
            'click #publishButton': 'publishPlugin',
            'click #downloadButton': 'downloadJSON',
            'click #createNewPluginButton': 'createNewPlugin',
            'click #createNewModuleButton': 'createNewModule',
            'click #createNewGeneratorButton': 'createNewGenerator',
            'click .selectPluginButton': 'pluginSelected',
            'click .selectModuleButton': 'moduleSelected',
            'click .selectGeneratorButton': 'generatorSelected',
            'click .selectTemplateButton': 'templateSelected',
            'click #createNewTemplateButton': 'createNewTemplate',
            'click .refreshGeneratedBtn' : 'refreshGeneratedCode',
            'keyup #nameofplugin' : 'pluginNameChanged',
            'keyup #descriptionofplugin': 'pluginDescriptionChanged',

            'click .generator': 'clickedCurrentGenerator',
            'click .temp-tab':  'clickedCurrentTemplate'
        },

        initialize: function(){
            _.bindAll(this);
            // this.model.on("change:currentPlugin", this.render, this);
            // this.model.on("change:currentModule", this.render, this);
            // this.model.on("change:currentGenerator", this.render, this);
            // this.model.on("change:currentTemplate", this.render, this);
            this.currentObj = appState;
            this.currentGenerator = null;
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

            var theme = "ace/theme/merbivore";
        	this.$el.html(this.template({ app: app }));
            this.templateEditor = ace.edit('templateEditor');
            this.templateEditor.setTheme(theme);
            // Detect the template mode (later)...
            // =this.templateEditor.getSession().setMode("aceDir/mode/javascript");
            this.codeEditor = ace.edit('codeEditor');
            this.codeEditor.setTheme(theme);
            this.codeEditor.getSession().setMode("ace/mode/javascript");

            this.defaultsEditor = ace.edit('defaultsEditor');
            this.defaultsEditor.setTheme(theme);
            this.defaultsEditor.getSession().setMode("ace/mode/json");

            this.renderGeneratorEditor();

            this.templateEditor.on("change", this.updateCurrentTemplate);
            this.codeEditor.on("change", this.updateCurrentCode);
            this.defaultsEditor.on("change", this.updateDefaultsEditor);

            this.refreshSidebar();
            this.refreshGeneratedCode();
        },


        clickedCurrentTemplate: function(e) {
            var temp = e.currentTarget.id.replace('temp-','');
            console.log(temp);
            this.renderTemplateEditor(temp);
        },

        clickedCurrentGenerator: function(e) {
            var path = e.currentTarget.dataset.path;
            var pMG = path.split('.');
            var gens = this.currentObj.plugins[pMG[0]][pMG[1]];
            _.each(gens, function(gen) {
                if(gen.name == pMG[2]) {
                    this.currentGenerator = gen;
                }
            }, this);

            this.renderGeneratorEditor();
        },



        renderGeneratorEditor: function(currentTemplate) {

            if (!this.currentGenerator) {
                this.$el.find('#no-generator').show();
                this.$el.find('#editorPanel').hide();
                return;
            }
            else {
                this.$el.find('#no-generator').hide();
                this.$el.find('#editorPanel').show();
            }

            this.setCodeEditor(this.currentGenerator.code);
            this.setDefaultsEditor(this.currentGenerator.defaults);
            this.renderTemplateEditor(currentTemplate);

            this.delegateEvents();
            console.log("Del");
        },

        renderTemplateEditor: function(currentTemplate) {
            var keys = _.keys(this.currentGenerator.templates);
            var currentTemplate = currentTemplate || keys[0];
            this.currentTemplate = currentTemplate;

            var tempCreate = [
            '<li class="create-tab">',
                '<span class="icon">+</span>',
                '<span id="createTemplateGroup" style="display:none;">',
                  '<div class="input-group">',
                    '<span class="input-group-btn">',
                     ' <button class="btn btn-default" id="createNewTemplateButton" type="button">Create</button>',
                    '</span>',
                    '<input type="text" placeholder="template name"id="newTemplateNameInput" class="form-control">',
                  '</div>',
                '</span>',
            '</li>'
            ].join('\n');

            var str = _.map(keys, function(key) { return "<li class='temp-tab' id='temp-"+key+"'>"+key+"</li>";  }).join('\n');
            str = str + tempCreate;
            this.$el.find('#templateList').html(str);

            var tmp = this.currentGenerator.templates[this.currentTemplate];
            this.setTemplateEditor(tmp);

            $('.temp-tab.active').removeClass('active');
            $('#temp-'+currentTemplate).addClass('active');

        },

        setTemplateEditor: function(template){
            this.templateEditor.setValue(template);
        },

        setCodeEditor: function(codeObj){
            this.codeEditor.setValue(codeObj);
        },

        setDefaultsEditor: function(defaultsObj) {
            this.defaultsEditor.setValue(JSON.stringify(defaultsObj, {}, 4));
        },

        createNewTemplate: function(event){
            event.stopPropagation();
            event.preventDefault();

             var newTemplateName = $.trim($(this.$el.find('#newTemplateNameInput')).val());
             var pluginName = this.model.get('currentPlugin');
             var mdlName = this.model.get('currentModule');
             var genName = this.model.get('currentGenerator');
             var obj = this.model.get('currentObject');
             if (newTemplateName !== "" && mdlName !== undefined && pluginName !== undefined && genName !== undefined){
                if (this.model.get('browsingLocalGenerators')){
                    var o = obj.plugins[pluginName][mdlName];
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
            } else {
                alert('check me out in the debugger');
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

        createNewPlugin: function(event) {
            var newPluginName = $.trim($(this.$el.find('#newPluginNameInput')).val());

            var o = this.model.get('currentObject');

            if (newPluginName !== "" && !o.plugins[newPluginName]){
                o.plugins[newPluginName] = {};

                this.model.set('currentObject', o, {silent: true});
                this.model.set('currentPlugin', newPluginName);
                this.model.setupCurrentModule({});
            }
        },

        createNewGenerator: function(event){
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
                    o.plugins[this.model.get('currentPlugin')][this.model.get('currentModule')].push(newGenerator);
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
                    o.plugins[this.model.get('currentPlugin')][newModuleName] = [];
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
                    currentObject: appState
                }
            };

            var str = JST['app/scripts/templates/Sidebar.ejs'](state);

            this.$el.find('#pluginBrowser').html(str);
            $(this.$el.find("#moduleSelector")).dropdown();

            var o = this.model.get('currentObject');
            o = o.plugins[this.model.get('currentPlugin')];

            if(o && o.metadata && o.metadata.name) $('#nameofplugin').val(o.metadata.name);
            if(o && o.metadata && o.metadata.description) $('#descriptionofplugin').val(o.metadata.description);

        },

        refreshGeneratedCode: function() {
            var currentObject = this.model.get('currentObject');
            var pluginName = this.model.get('currentPlugin');
            var mdlName = this.model.get('currentModule');
            var genName = this.model.get('currentGenerator');

            var generatorPath = pluginName + "." + mdlName + "." + genName;

            var Vm = function() {

                this.runCode = function(code, globals) {
                    var templates = globals.templates;
                    var data = globals.data;
                    var expand = globals.expand;
                    return eval(code);
                };

            };

            var VM = new Vm();
            var expander = expanderfactory(function(code, globals) {
                return VM.runCode(code, globals);
            });


            $('#generatedCode').html("");

            try {
                var generated = expander.expand(appState.plugins, {generate: generatorPath, data: {}});
                console.log(generated);

                if(typeof generated == "object") {
                    var str = "";
                    _.each(generated, function(val, key) {
                        str += '<h4>' + key + '</h4><pre>'+val+'</pre>';
                    });
                     $('#generatedCode').html(str);
                }
                else if (typeof generated == "string") {
                    $('#generatedCode').html('<pre>' + generated + '</pre>');
                }

            }
            catch (e) {
                $('#generatedCode').html("Could not be generated: "+ e);
            }
        },

        updateCurrentTemplate: function(){
            var str = this.templateEditor.getValue();
            console.log(this.currentGenerator[this.currentTemplate]);
            this.currentGenerator.templates[this.currentTemplate] = str;
        },

        updateCurrentCode: function() {
            var str = this.codeEditor.getValue();
            this.currentGenerator.code = str;
        },

        updateDefaultsEditor: function() {
            var defs = {};
            try {
                defs = jQuery.parseJSON(this.defaultsEditor.getValue());
            }
            catch(e) {
                console.log("Couldnt parse defaults");
                console.log(e);
            }

            this.currentGenerator.defaults = defs;
        },

        findGenByName: function(module, genName){
            for (var i = 0; i < module.length; i++){
                if (genName === module[i].name){
                    return module[i];
                }
            }
        },

        pluginNameChanged: function() {
            var o = this.model.get('currentObject');
            o = o.plugins[this.model.get('currentPlugin')];
            console.log(o);
            console.log("changed");

            if(!o.metadata) o.metadata = {};
            o.metadata.name = $('#nameofplugin').val();
        },

        pluginDescriptionChanged: function() {
            var o = this.model.get('currentObject');
            o = o.plugins[this.model.get('currentPlugin')];

            if(!o.metadata) o.metadata = {};
            o.metadata.description = $('#descriptionofplugin').val();
        },

        getCurrentPluginList: function(){
            if (this.model.get('browsingLocalGenerators')){
                return (this.model.get('currentObject').plugins);
            } else {
                return (this.model.get('currentObject').plugins);
            }
        },

        loadAppstate: function(){
            $('#loadModal').modal();
        },

        saveAppstate: function(){

            // this.saveTemplateEditor();
            // this.saveCodeEditor();

            function successHandler () {
                var modal = $('#downloadModal').modal();
                $(modal).find('#downloadEditor').text("Saved Successfully.");
            }

            $.ajax({
                type: "POST",
                url: '/app/' + appId + '/state/force/',
                data: JSON.stringify(appState),
                statusCode: {
                    200: successHandler
                },
                dataType: "JSON"
            });

        }
    });

    return PluginEditorView;
});
