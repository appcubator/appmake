#!/usr/bin/env node

var rest = require('restler');
rest.get('http://127.0.0.1:3000/plugins/list').on('complete', function(data) {
    console.log( JSON.stringify(data[0], null, 4) );
});
