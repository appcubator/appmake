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
        render: function(){
        	var result = this.template({});
        	this.$el.html( result );
        },
        initialize: function(){
            this.render();
        }
    });

    return HomeView;
});
