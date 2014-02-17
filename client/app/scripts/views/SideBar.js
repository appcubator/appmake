/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
], function ($, _, Backbone, JST) {
    'use strict';

    var AppView = Backbone.View.extend({
        template: JST['app/scripts/templates/Sidebar.ejs'],
        events: {
        },
        render: function(){
            var state = {app: {
                currentObject: this.model.get('currentObject'),
                authenticated: this.model.get('authenticated'),
                currentPlugin: this.model.get('currentPlugin'),
                currentModule: this.model.get('currentModule'),
                currentGenerator: this.model.get('currentGenerator'),
                browsingLocalGenerators: this.model.get('browsingLocalGenerators')                    
            }}
            alert('yo');
            console.log(state);
            console.log(state.currentObject);
        	var result = this.template(state);
        	this.$el.html( result );
        },
        initialize: function(){
            this.render();
        }
    });

    return AppView;
});
