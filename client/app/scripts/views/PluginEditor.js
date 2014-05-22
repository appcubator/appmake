/*global define*/

// TODO 1. Fix publishing 2. get docs working 3. Delete




define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'Markdown',
    'ace',
    'bootstrap',
    'jquery-hotkeys',
    'util.path'
], function ($, _, Backbone,  JST, Markdown) {
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
            'dblclick .generator': 'renameGenerator',
            'click .temp-tab':  'clickedCurrentTemplate',
            'click .create-tab' : 'clickedAddTemplate',
            'submit #newTemplateForm': 'createNewTemplate',
            'click .create-plugin' : 'clickedNewPlugin',
            'submit .create-plugin-form': 'createNewPlugin',
            'click .create-module': 'clickedNewModule',
            'submit .create-module-form': 'createNewModule',
            'click .create-generator': 'clickedNewGenerator',
            'submit .create-generator-form': 'createNewGenerator',
            'click #finishPublish': 'publishPluginToRepo',
            'click #toggleSidebar': 'toggleSidebar',
            'click .deleteTemplateButton': 'deleteTemplate',
            'click #showDocsButton': 'showDocs',
            'click #showGeneratedCodeButton': 'showGenCode',
            'click #readDocsButton': 'renderCurrentDocs',
            'click #editDocsButton': 'editDocs',
            'click #saveDocsButton': 'saveDocs'
        },

        initialize: function(options){
            _.bindAll(this);
            this.currentObj = appState;
            this.currentGenerator = null;
            this.router = options.router;



            // This code is for the timer that controls code generation
            this.generateInterval = 1400;
            this.maxWait = 1;
            this.generateWait = 0;
            this.hasValidGenerator = false;
            this.expander = initExpander();

            if (options.path && options.path != "editor") {

                var path = options.path;
                var gen = this.getGenFromPath(path);
                this.currentGenerator = gen;
                this.currentPath = path;

            }

            // Documentation
            this.currentDocs = '';

            this.render();
            // this.enableContextMenu();
            this.generateInterval = setInterval(this.checkCodeGeneration, this.generateInterval);

            window.onbeforeunload = function() {
                return ('You may lose work if you haven not saved your progress.');
            };
        },
        enableContextMenu: function (){
            // Enable context menus
            var $contextMenu = $("#contextMenu");
            $("body").on("contextmenu", function(e) {
                $contextMenu.css({
                    display: "block",
                    left: e.pageX,
                    top: e.pageY
                });
                return false;
            });

            $contextMenu.on("click", "a", function() {
                $contextMenu.hide();
            });
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
            };

            var theme = 'ace/theme/merbivore';
            this.$el.html(this.template({ app: app }));
            this.templateEditor = ace.edit('templateEditor');
            this.templateEditor.setTheme(theme);
            this.templateEditor.setShowPrintMargin(false);

            // Detect the template mode (later)...
            // =this.templateEditor.getSession().setMode('aceDir/mode/javascript');
            this.codeEditor = ace.edit('codeEditor');
            this.codeEditor.setTheme(theme);
            this.codeEditor.getSession().setMode('ace/mode/javascript');
            this.codeEditor.setShowPrintMargin(false);


            this.defaultsEditor = ace.edit('defaultsEditor');
            this.defaultsEditor.setTheme(theme);
            this.defaultsEditor.getSession().setMode('ace/mode/json');
            this.defaultsEditor.setShowPrintMargin(false);

            this.docsEditor = ace.edit('docsEditor');
            this.docsEditor.setValue(this.currentDocs);
            this.docsEditor.setShowPrintMargin(false);

            this.renderGeneratorEditor();

            this.templateEditor.on('change', this.updateCurrentTemplate);
            this.codeEditor.on('change', this.updateCurrentCode);
            this.defaultsEditor.on('change', this.updateDefaultsEditor);
            this.templateEditor.on('change', this.updateCurrentTemplate);


            this.refreshSidebar();
            //this.refreshGeneratedCode();

            var self = this;
            $(document).bind('keydown', 'meta+s', function(e) {
                e.preventDefault();
                self.saveAppstate();
            });

            $('#pluginEditor').bind('keydown', function(e) {
                if (e.altKey || e.ctrlKey || e.shiftKey){
                    return;
                } else {
                    self.generateWait = 0;
                }
            });

            $(document).bind('keydown', 'ctrl+s', function(e) {
                e.preventDefault();
                self.saveAppstate();
            });
        },

        toggleSidebar: function (event) {
            $('.right-cell').toggleClass('hidden');
        },

        deleteTemplate: function (event){
            var id = $(event.target).closest('.temp-tab').attr('id').replace('temp-','');
            delete this.currentGenerator.templates[id];
            this.render();
        },

        updateCurrentDocs: function (){
            console.log('Update the docs brah');
        },

        checkCodeGeneration: function (force){
            // console.log('Check code generation');
            // console.log(this.generateWait);
            // console.log(this.currentPath);
            this.generateWait++;

            // force the generation even if
            if (this.currentPath !== undefined && (this.generateWait > this.maxWait || force)){
                // console.log('Generate the damn code');
                this.generateWait = 0;

                $('#generatedCode').html('');
                try {
                    // This will force it to use defaults in the generator
                    // console.log('Trying to generate code')
                    var gPath = this.currentPath;

                    var generated = this.expander.expand(appState.plugins, {generate: gPath, data: {}});


                    if(typeof generated === 'object') {
                        var str = $('<div>');

                        _.each(generated, function(val, key) {
                            str.append($('<h4>').text(key));
                            str.append($('<pre>').text(val));
                        });
                        $('#generatedCode').html(str);
                    }
                    else if (typeof generated === 'string') {
                        $('#generatedCode').html('<pre>' + generated + '</pre>');
                    }


                }
                catch (e) {
                    $('#generatedCode').html('Could not be generated: '+ e);
                }
            }
        },

        renameGenerator: function(e) {
            var path = e.currentTarget.dataset.path;
            var generator = this.getGenFromPath(path);

            var name = util.packageModuleName(path).name;
            var newName = prompt("Change the name of the generator to:", name);
            if(newName == "" || newName == null) { return this.renameGenerator(generator, path); }

            generator.name = newName;

            this.refreshSidebar();

            var newPath = util.path(path).changeName(newName);
            this.changePaths(path, newPath)
        },

        changePaths: function(path, newPath) {
            function changePathsHelper(val) {

                if(val.generate && val.generate == path) {
                    val.generate = newPath;
                }

                _.each(val, function(subval, key) {
                    if(subval == null || typeof subval == 'string') return;
                    changePathsHelper(subval);
                });

            }

            _.each(appState, function(val, key) {
                if(val == null || typeof val == 'string') return;
                changePathsHelper(val);
            });
        },

        clickedCurrentTemplate: function(e) {
            var temp = e.currentTarget.id.replace('temp-',''); // We should change this to a data attr...
            this.renderTemplateEditor(temp);
        },

        clickedCurrentGenerator: function(e) {
            var path = e.currentTarget.dataset.path;
            var gen = this.getGenFromPath(path);

            // if(this.currentPath === path) { this.renameGenerator(gen, path); }
            this.currentGenerator = gen;
            this.currentPath = path;

            this.currentDocs = '';
            this.renderCurrentDocs();

            this.renderGeneratorEditor();
        },

        renderCurrentDocs: function (){
            console.log('render the docs');
            console.log('Here are the current', this.currentDocs);

            var docs = '';
            $('#docsEditor').addClass('hidden');
            $('#docsContainer').removeClass('hidden');


            if (this.currentGenerator.docs === ''){
                this.currentGenerator.docs = "**Define documentation for this generator**";
            }
            var docs = this.currentGenerator.docs
            var converter = Markdown.getSanitizingConverter();
            var mdhtml = converter.makeHtml(docs);
            $('#docsContainer').html(mdhtml);
            $('#docsContainer').removeClass();
        },
        editDocs: function (){
            if (this.docsEditor == undefined){
                console.log("Y U UNDEFINE");
            } else {
                $('#docsContainer').addClass("hidden");
                $('#docsEditor').removeClass("hidden");
                this.docsEditor.setValue(this.currentGenerator.docs);
            }
        },
        saveDocs: function (){
            console.log("Save the current docs");
            var mdText = this.docsEditor.getValue();
            this.currentGenerator.docs = mdText;
            this.saveAppstate(true); // Silently save to appstate
            this.renderCurrentDocs();

            this.currentGenerator.docs = mdText;

            console.log(appState);
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
                     ' <button class="btn btn-small btn-success" id="createNewTemplateButton" type="button">Create</button>',
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
                    return "<li class='temp-tab' id='temp-"+key+"'> <span class='temp-tab-label'>"+key+"</span> <span class='deleteTemplateButton glyphicon glyphicon-remove'></span> </li>";
                }).join('\n');
            }

            str = str + tempCreate;
            this.$el.find('#templateList').html(str);

            var tmp = this.currentGenerator.templates[this.currentTemplate];
            this.setTemplateEditor(tmp, this.currentTemplate);

            $('.temp-tab.active').removeClass('active');
            $('#temp-'+currentTemplate).addClass('active');

        },

        setTemplateEditor: function(template, templateName){
            this.templateEditor.setValue(template);

            if (!templateName) return;

            if (templateName.indexOf('js') > -1 || templateName.indexOf('code') > -1) {
                this.templateEditor.getSession().setMode("ace/mode/javascript");
            }

            if (templateName.indexOf('html') > -1) {
                this.templateEditor.getSession().setMode("ace/mode/html");
            }

            if (templateName.indexOf('css') > -1) {
                this.templateEditor.getSession().setMode("ace/mode/css");
            }
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
                docs: "",
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
            var o = this.model.get("currentObject").serialize();
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
            var s = $('#defaultsEditorContainer').find('.status');
            try {
                s.addClass('status status-success');
                defs = jQuery.parseJSON(this.defaultsEditor.getValue());

                s.removeClass();
                s.addClass('status status-success');

            }
            catch(e) {
                // console.log('Couldnt parse defaults');
                // console.log(e);
                s.removeClass();
                s.addClass('status status-warning');
            }
            this.currentGenerator.defaults = defs;
            //this.refreshGeneratedCode()
        },
        getGenFromPath: function(path) {
            var gen;
            try {
                gen = this.expander.findGenData(this.currentObj.plugins, this.expander.parseGenID(path));
            } catch (e) {
                if (e.name && ((e.name === 'GenNotFound') || (e.name === 'GenPathSyntax'))) {
                    // This is only supposed to happen in the case where user types url manually and the generator doesn't exist.
                    this.router.navigate('/');
                } else {
                    throw e;
                }
            }
            return gen;
        },

        pluginNameChanged: function() {
            var o = this.model.get('currentObject');
            o = obj.plugins[this.model.get('currentPlugin')];

            if (!obj.metadata) {
                obj.metadata = {};
            }
            obj.metadata.name = $('#nameofplugin').val();
        },

        pluginDescriptionChanged: function() {
            var o = this.model.get('currentObject');
            o = obj.plugins[this.model.get('currentPlugin')];

            if (!obj.metadata) obj.metadata = {};
            obj.metadata.description = $('#descriptionofplugin').val();
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

        saveAppstate: function(silent){
            // this.saveTemplateEditor();
            // this.saveCodeEditor();
            var silent = silent;
            function successHandler () {
                console.log(silent);
                if (silent !== true) {
                    var modal = $('#downloadModal').modal();
                    $(modal).find('#downloadEditor').text('Saved Successfully.');
                    console.log('Saved successfully');
                }
            }
            var errorHandler = function (jqXHR, textStatus, errorThrown) {
                var modal = $('#downloadModal').modal();
                $(modal).find('#downloadEditor').text('Error saving: ' + textStatus+ '. See js log for details.');
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            };

            $.ajax({
                type: 'POST',
                url: '/app/' + appId + '/state/force/',
                data: JSON.stringify(appState),
                statusCode: { 200: successHandler },
                error: errorHandler,
                dataType: 'JSON'
            });
        },

        publishPlugin: function(){
            var aState = this.currentObj;
            console.log("PUBLISH PLUGIN CALLED");


            if (this.currentPath === undefined){
            console.log("currentPath undefined");

                $('#errorModal').modal();
                $('#errorModal').find('#errorMessage').text('Please select a generator to publish the cooresponding plugin.')
            } else {
                if (aState === undefined ) {
                    console.log("astate undefined");

                    $('#errorModal').modal();
                    $('#errorModal').find('#errorMessage').text('Whoops. Appstate undefined.');
                } else {    
                        var currentPluginName = this.currentPath.split(".")[2];
                        /// Check if the plugin name is taken, and suggest others

                        var currentPluginName = this.currentPath.split(".")[0];
                        console.log("publishtorepo");
                        $('#publishModal').modal();
                        $('#publishModal').find('#requestedPluginName').val(currentPluginName);    

                    
                }    
            }
            
        },
        publishPluginToRepo: function(){
            console.log('Publishing plugin to repo');
            var currentPluginName = this.currentPath.split('.')[0];
            var p = $.extend(true, this.currentObj.plugins[currentPluginName], {});
            p.metadata = {
                name: currentPluginName,
                version: '0.1',
                description: $('#pluginDescription').val(),
                docs: p.docs
            }
            console.log('We about to create a new plugin', p);

            var repoAddr = DEBUG ? 'http://127.0.0.1:3000/' : 'http://plugins.appcubator.com/';
            // var repoAddr = 'http://plugins.appcubator.com/';

            $.post(repoAddr + 'plugins/create', p, function (res){
                if (res.success){
                    console.log('Plugin created successfully.')
                    console.log(res.plugin);
                    $('#publishStatus').text('Plugin ' + res.plugin.metadata.name + res.plugin.metadata.version + ' created!');
                } else {
                    console.log('Plugin already exists...making a new version...');
                    $.post(repoAddr + 'plugins/update', p, function (res){
                        if (res.success !== true) {
                            $('#publishStatus').text('Failed to publish.');
                        } else {
                            console.log(res.plugin);

                            $('#publishStatus').text('Plugin ' + res.plugin.metadata.name + ' updated to version ' + res.plugin.metadata.version);
                            console.log('Plugin updated successfully.')
                        }
                    })
                }
            });
        }
    });
    return PluginEditorView;
});
