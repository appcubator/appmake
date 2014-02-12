/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var LoaderviewView = Backbone.View.extend({
        template: JST['app/scripts/templates/LoaderView.ejs']
    });

    return LoaderviewView;
});
