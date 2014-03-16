/*global define*/

// TODO 1. Fix publishing 2. get docs working 3. Delete




define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'ace',
    'bootstrap',
    'jquery-hotkeys'
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

            // 'click #createNewTemplateButton': 'createNewTemplate',
            'click .refreshGeneratedBtn' : 'refreshGeneratedCode',
            'keyup #nameofplugin'        : 'pluginNameChanged',
            'keyup #descriptionofplugin' : 'pluginDescriptionChanged',

            'click .generator': 'clickedCurrentGenerator',
            'click .temp-tab':  'clickedCurrentTemplate',
            'click .create-tab' : 'clickedAddTemplate',
            'submit #newTemplateForm': 'createNewTemplate',
            'click .create-plugin' : 'clickedNewPlugin',
            'submit .create-plugin-form': 'createNewPlugin',
            'click .create-module': 'clickedNewModule',
            'submit .create-module-form': 'createNewModule',
            'click .create-generator': 'clickedNewGenerator',
            'submit .create-generator-form': 'createNewGenerator',
            'click #finishPublish': 'publishPluginToRepo'
        },

        initialize: function(){
            _.bindAll(this); 
            this.currentObj = appState;
            this.currentGenerator = null;


            // This code is for the timer that controls code generation
            this.generateInterval = 1400;
            this.maxWait = 1;
            this.generateWait = 0;
            this.hasValidGenerator = false;
            this.expander = initExpander();


            this.render();
            this.generateInterval = setInterval(this.checkCodeGeneration, this.generateInterval);

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
            //this.refreshGeneratedCode();

            var self = this;
            $(document).bind('keydown', 'meta+s', function(e) {
                e.preventDefault();
                self.saveAppstate();
            });

            $("#pluginEditor").bind('keydown', function(e) {
                if (e.altKey || e.ctrlKey || e.shiftKey){
                    return
                } else {
                    self.generateWait = 0;
                }
            });

            $(document).bind('keydown', 'ctrl+s', function(e) {
                e.preventDefault();
                self.saveAppstate();
            });
        },
        checkCodeGeneration: function (force){
            // console.log("Check code generation");
            // console.log(this.generateWait);
            // console.log(this.currentPath);
            this.generateWait++;

            // force the generation even if 
            if (this.currentPath !== undefined && (this.generateWait > this.maxWait || force)){
                // console.log("Generate the damn code");
                this.generateWait = 0;

                $('#generatedCode').html("");
                try {
                    // This will force it to use defaults in the generator
                    // console.log("Trying to generate code")
                    var gPath = this.currentPath;

                    var generated = this.expander.expand(appState.plugins, {generate: gPath, data: {}});


                    if(typeof generated == "object") {
                        var str = $("<div>");

                        _.each(generated, function(val, key) {
                            str.append($("<h4>").text(key));
                            str.append($("<pre>").text(val));
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
            } 
        },


        clickedCurrentTemplate: function(e) {
            var temp = e.currentTarget.id.replace('temp-','');
            this.renderTemplateEditor(temp);
        },

        clickedCurrentGenerator: function(e) {
            var path = e.currentTarget.dataset.path;
            var pMG = path.split('.');
            var gens = this.currentObj.plugins[pMG[0]][pMG[1]];
            _.each(gens, function(gen) {
                if(gen.name == pMG[2]) {
                    this.currentGenerator = gen;
                    this.currentPath = path;
                    // console.log("Setting currentpath to", this.currentPath)
                }
            }, this);

            this.renderGeneratorEditor();
        },

        clickedNewGenerator: function(e) {
            var $el = $(e.currentTarget);
            $el.find('.create-button').hide();
            $el.find('.create-generator-form').fadeIn();
            $el.find('.newGeneratorNameInput').focus();
        },

        clickedAddTemplate: function(e) {
            var $el = $(e.currentTarget);
            $el.find('.icon').hide();
            $('#createTemplateGroup').fadeIn();
            $('#newTemplateNameInput').focus();
        },

        clickedNewPlugin: function(e) {
            var $el = $(e.currentTarget);
            $el.find('.create-button').hide();
            $el.find('.create-plugin-form').fadeIn();
            $el.find('#newPluginNameInput').focus();
        },

        clickedNewModule: function(e) {
            var $el = $(e.currentTarget);
            $el.find('.create-button').hide();
            $el.find('.create-module-form').fadeIn();
            $el.find('.newModuleNameInput').focus();
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

                $('.dir.generator.active').removeClass('active');
                $('[data-path="'+ this.currentPath +'"]').addClass('active');
            }

            this.setCodeEditor(this.currentGenerator.code);
            this.setDefaultsEditor(this.currentGenerator.defaults);
            this.renderTemplateEditor(currentTemplate);

            this.delegateEvents();
        },

        renderTemplateEditor: function(currentTemplate) {
            console.log("This is being called");
            var keys = _.keys(this.currentGenerator.templates);
            var currentTemplate = currentTemplate || keys[0];
            this.currentTemplate = currentTemplate;

            var tempCreate = [
            '<li class="create-tab">',
                '<span class="icon">+</span>',
                '<span id="createTemplateGroup" style="display:none;">',
                  '<form class="input-group" id="newTemplateForm">',
                    '<span class="input-group-btn">',
                     ' <button class="btn btn-default" id="createNewTemplateButton" type="button">Create</button>',
                    '</span>',
                    '<input type="text" placeholder="template name"id="newTemplateNameInput" class="form-control">',
                  '</form>',
                '</span>',
            '</li>'
            ].join('\n');

            var str = "";
            /* Fix this */
            if(this.currentGenerator.templates == {} || this.currentGenerator.templates.undefined == "") { str = "<li class='small'>No Templates</li>"; }
            else {
                str = _.map(keys, function(key) {
                    return "<li class='temp-tab' id='temp-"+key+"'>"+key+" <span class='deleteTemplateButton glyphicon glyphicon-remove'></span> </li>";
                }).join('\n');
            }

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
            event.preventDefault();
            var newTemplateName = $.trim($(this.$el.find('#newTemplateNameInput')).val());
            this.currentGenerator.templates[newTemplateName] = "";
            this.currentGenerator.templates = _.omit(this.currentGenerator.templates, "undefined");
            this.renderTemplateEditor(newTemplateName);
        },

        createNewPlugin: function(e) {
            e.preventDefault();
            var newPluginName = $.trim($(this.$el.find('#newPluginNameInput')).val());
            this.currentObj.plugins[newPluginName] = {};
            this.refreshSidebar();
        },

        createNewModule: function(e) {
            e.preventDefault();
            var $form = $(e.currentTarget);
            var newModuleName = $.trim($form.find('.newModuleNameInput').val());
            var path = $form.data('modulepath').split('.');
            var plugin = path[0];
            this.currentObj.plugins[plugin][newModuleName] = [];
            this.refreshSidebar();
        },

        createNewGenerator: function(e) {
            e.preventDefault();
            var $form = $(e.currentTarget);
            var newGeneratorName = $.trim($form.find('.newGeneratorNameInput').val());
            var path = $form.data('path').split('.');
            var plugin = path[0];
            this.currentObj.plugins[plugin][path[1]].push({
                name: newGeneratorName,
                code: "",
                version: "0.1",
                defaults: {},
                templates: []
            });
            var currentGen = _.last(this.currentObj.plugins[plugin][path[1]]);

            this.currentGenerator = currentGen;
            this.refreshSidebar();
            this.renderGeneratorEditor();
        },

        downloadJSON: function(event){
            var modal = $('#downloadModal').modal();
            var o = this.model.serialize();
            $(modal).find('#downloadEditor').text(o);
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
            if (o.plugins !== undefined){
                o = o.plugins[this.model.get('currentPlugin')];
            } else {
                o.plugins = {};
            }

            if(o && o.metadata && o.metadata.name) $('#nameofplugin').val(o.metadata.name);
            if(o && o.metadata && o.metadata.description) $('#descriptionofplugin').val(o.metadata.description);

            $('.module-span').on('click', function(e) {

                var module = e.currentTarget.dataset.modulepath;
                var $el = $('.dir[data-modulepath="'+ module +'"]');

                if($el.hasClass('shrunk')) {
                    $el.removeClass('shrunk');
                }
                else {
                    $el.addClass('shrunk');
                }
            });

            $('.plugin-span').on('click', function(e) {
                var module = e.currentTarget.dataset.pluginpath;
                // Set the partial plugin path....
                $('.plugin-span').removeClass("active")
                $(e.currentTarget).addClass("active")

                var $el = $('.dir[data-pluginpath="'+ module +'"]');
                this.currentPath = e.currentTarget.dataset.pluginpath + "."
                if($el.hasClass('shrunk')) {
                    $el.removeClass('shrunk');
                }
                else {
                    $el.addClass('shrunk');
                }
            });



        },


        updateCurrentTemplate: function(){
            var str = this.templateEditor.getValue();
            this.currentGenerator.templates[this.currentTemplate] = str;
        },

        updateCurrentCode: function() {
            var str = this.codeEditor.getValue();
            this.currentGenerator.code = str;
        },

        updateDefaultsEditor: function() {
            var defs = {};
            var s = $('#defaultsEditorContainer').find(".status");
            try {
                s.addClass("status status-success");
                defs = jQuery.parseJSON(this.defaultsEditor.getValue());

                s.removeClass();
                s.addClass("status status-success");

            }
            catch(e) {
                // console.log("Couldnt parse defaults");
                // console.log(e);
                s.removeClass();
                s.addClass("status status-warning")
            }
            this.currentGenerator.defaults = defs;
            //this.refreshGeneratedCode()
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
            // console.log(o);
            // console.log("changed");

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
        }, 
        publishPlugin: function(){
            var aState = this.currentObj;
            if (this.currentPath === undefined){
                $("#errorModal").modal()
                $($("#errorModal").find("#errorMessage")).text("Please select a generator to publish the cooresponding plugin.")
            }
            if (aState === undefined ){ 
                $("#errorModal").modal()
                $($("#errorModal").find("#errorMessage")).text("Whoops. Appstate undefined.")              
            } else {
                var currentPluginName = this.currentPath.split(".")[0];
                $('#publishModal').modal()
                $($('#publishModal').find("#requestedPluginName")).val(currentPluginName);                
            } 
        },
        publishPluginToRepo: function(){
            console.log("Publishing plugin to repo");
            var currentPluginName = this.currentPath.split(".")[0];
            var p = $.extend(true, this.currentObj.plugins[currentPluginName], {});
            p.metadata = {
                name: currentPluginName,
                version: "0.1",
                description: $('#pluginDescription').val()
            }
            console.log("We about to create a new plugin", p);

            // var repoAddr = DEBUG ? 'http://127.0.0.1:3000/' : "http://plugins.appcubator.com/";
            var repoAddr = "http://plugins.appcubator.com/";

            $.post(repoAddr + "plugins/create", p, function (res){
                if (res.success){
                    console.log("Plugin created successfully.")
                    console.log(res.plugin)
                } else {
                    console.log("Plugin already exists...making a new version...");
                    $.post(repoAddr + "plugins/update", p, function (res){
                        if (res.success !== true) {
                            console.log("Failed to publish plugin");
                        } else {
                            console.log("Plugin updated successfully.")
                            console.log(res.plugin)
                        }
                    })
                }
            });         
        }
    });
    return PluginEditorView;
});
