#!/usr/bin/env node
var validator = require('./frontend/validator');
var expander = require('./frontend/expander');
var writer = require('./backend/writer');

if (require.main === module) {
    // TODO abide by interface in readme
    process.stdin.resume();

    var jsonStrings = [];

    process.stdin.on('data', function(chunk) {
        jsonStrings.push(chunk);
    });

    process.stdin.on('end', function() {
        var app = JSON.parse(jsonStrings.join(''));
        // TODO validate structure and do static analysis
        var warnings = validator.validate(app);
        // expand the code generators
        expander.expandAll(app);
        // write output to a temporary directory
        writer.writeTemp(app, function(x) { return process.stdout.write(x) });
    });
}
