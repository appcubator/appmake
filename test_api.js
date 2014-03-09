#!/usr/bin/env node

var rest = require('restler');


String.prototype.firstNLines = function(n) {
    return this.split('\n').slice(0, n).join('\n');
};

(function (url) {
    rest.get('http://127.0.0.1:3000' + url).on('complete', function(data) {
        console.log('\n\nGET ' + url);
        console.log( JSON.stringify(data, null, 4).firstNLines(15) );
    });
}) ('/plugins/list');

(function (url) {
    rest.get('http://127.0.0.1:3000' + url).on('complete', function(data) {
        console.log('\n\nGET ' + url);
        console.log( JSON.stringify(data, null, 4).firstNLines(15) );
    });
}) ('/plugins/root');


(function (url) {
    var newplugin = {
        uielements: [{
            name: 'test',
            code: 'test',
            templates: {test:'test'}
        },{
            name: 'test2',
            code: 'test',
            templates: {test:'test'}
        }],
        model_methods: [{
            name: 'test',
            code: 'test',
            templates: {test:'test'}
        },{
            name: 'test2',
            code: 'test',
            templates: {test:'test'}
        }],
        metadata: {
            name: 'testnewplugin',
            description: 'cool test yo'
        }
    }
    rest.put('http://127.0.0.1:3000' + url, {data: newplugin}).on('complete', function(data) {
        console.log('\n\nPUT ' + url);
        console.log( JSON.stringify(data, null, 4).firstNLines(15) );

        (function (url) {
            rest.get('http://127.0.0.1:3000' + url).on('complete', function(data) {
                console.log('\n\nGET ' + url);
                console.log( JSON.stringify(data, null, 4).firstNLines(15) );
            });
        }) ('/plugins/testnewplugin');

    });
}) ('/plugins/publish');
