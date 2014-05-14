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
            "#pluging-search-form submit" : "searchSubmitted"
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

        renderList: function(list) {
            console.log(list);
            var $list = $('#search-list');
            $list.html('');

            _.each(function(val, ind) {
                $list.append(val.name);
            })
        },

        renderError: function() {
            $list.html('Error.');
        }


    });

    return HomeView;
});
