/*global define*/

define([
    'jquery',
    'backbone'
], function ($, Backbone) {
    'use strict';

    var AppRouter = Backbone.Router.extend({
		routes: {
            "": "index",
            "generators/:pkg/:mdl/:gen": "generator",
            "package/:pkg": "pkg",
            "module/:pkg/:mdl": "module"
        },              
        index: function() {
            
        },
        generator: function(pkg, mdl, gen) {
            var uri = "generators/" + pkg + "/" + mdl + "/" + gen;
            $.ajax({
                url: uri,
                success: function(res){
                    console.log(res);
                    currentGeneratorView.render(res);
                }
            })           
        },
        pkg: function (packageName){
            var uri = "package/" + pkg
            $.ajax({
                url: uri,
                success: function (res){
                    console.log(res);
                }
            })
        }
    });

    return AppRouter;
});
