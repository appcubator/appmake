/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var GeneratorView = Backbone.View.extend({
        template: JST['app/scripts/templates/Generator.ejs'],
        render: function(generator){
        	if (generator.templates.html){
        		generator.templates.html = $("<div>").text(generator.templates.html).html();
        	}
        	var result = this.template(generator);
        	this.$el.html( result );
        }
    });

    return GeneratorView;
});
