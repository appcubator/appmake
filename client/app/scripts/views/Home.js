/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'typeahead'
], function ($, _, Backbone, JST, typeahead) {
    'use strict';

    var HomeView = Backbone.View.extend({
        template: JST['app/scripts/templates/Home.ejs'],
        render: function(){
        	var result = this.template({});
        	this.$el.html( result );
        },
        initialize: function(){
            this.render();
            this.model.on('change:generators', this.setTypeahead, this);
        },
        setTypeahead: function(){
            var generators = this.model.get('generators'); 
            $('input#repoSearchInput').typeahead({
                name: 'generators',
                local: generators,
                valueKey: 'name',
                template: JST['app/scripts/templates/Gen.ejs']
            });
        }
    });

    return HomeView;
});
