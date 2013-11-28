#!/usr/bin/env node
var validator = require('./frontend/validator');
var expander = require('./frontend/expander');
var writer = require('./backend/writer');
var fs = require('fs');
var path = require('path');

if (require.main === module) {
    var USAGE = '\n  Usage:\n\n'+
                '    ./appmake.js compile <json_file> <output_dir>\n\n' +
                '       Compiles the app given by the json_file, and outputs\n' +
                '           a node app at the output_dir.\n\n' +
                '    ./appmake.js deploy <app_dir>\n\n' +
                '       Deploys the app in app_dir to the Appcubator cloud.\n\n';

    switch (process.argv[2]) {

        case "compile":
            if (process.argv.length < 5) {
                process.stdout.write(USAGE);
                break;
            }
            var srcJsonFile = process.argv[3];
            var destPath = process.argv[4];
            // TODO #{destPath} is not empty. Do you want to continue?

            var appJson = fs.readFileSync(srcJsonFile);
            var app = JSON.parse(appJson);

            // TODO validate structure and do static analysis
            var warnings = validator.validate(app);

            // expand the code generators
            expander.expandAll(app);

            // write out
            writer.write(app, destPath, function() { return process.stdout.write('Done: '+path.resolve(destPath)+'\n') });

            break;

        case "deploy":
            process.stdout.write('Deploy not yet implemented\n');
            break;

        default:
            process.stdout.write(USAGE);
            break;
    }
}
