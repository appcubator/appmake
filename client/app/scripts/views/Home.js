/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
], function ($, _, Backbone, JST) {
    'use strict';

    var HomeView = Backbone.View.extend({
        
        template: JST['app/scripts/templates/Home.ejs'],
        
        events: {
            "submit #pluging-search-form" : "searchSubmitted",
            "keydown #repoSearchInput" : "searchInputChanged"
        },

        render: function(){
        
        	var result = this.template({});
        	this.$el.html( result );
        
        },
        
        initialize: function(){
            _.bindAll(this);
            this.render();
        },

        searchSubmitted: function(e) {
            e.preventDefault();
            var self = this;
            var val = $('#repoSearchInput').val();
            $.ajax({
                type: "GET",
                url: '/plugins/search?q='+val,
                statusCode: {
                    200: function(data) {
                        self.renderList(data)
                    },
                    400: function(jqxhr) {
                        self.renderError();
                    },
                },
                dataType: "JSON"
            });
        },

        searchInputChanged: function(e) {
            if ($('#repoSearchInput').val().length) {
                $('#search-button').val("Search");
            }
            else {
                $('#search-button').val("View All Generators");

            }
        },

        renderList: function(list) {
            var $list = $('#search-list');
            $list.html('');

            if(list.length == 0) {
                $list.append("No results found.");
            }

            var template = [ "<li class='plugin-row'><a href='/plugins/<%= name %>/'>",
                "<span class='name'><%= name %></span>",
                "<span class='version'><%= version %></span>",
                "<div class='description'><%= description %></div>",
            "</a></li>"].join('\n');

            _.each(list, function(val, ind) {
                $list.append(_.template(template, val.metadata));
            });

        },

        renderError: function() {
            $list.html('Error.');
        }


    });

    return HomeView;
});
