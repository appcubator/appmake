#!/usr/bin/env node
var parser = require('./frontend/parser');
var validator = require('./frontend/validator');
var expander = require('./frontend/expander');
var writer = require('./backend/writer');
var fs = require('fs');
var path = require('path');

if (require.main === module) {
    var USAGE = '\n  Usage:\n\n'+
                '    ./appmake.js parse <src_dir> <json_file_out>\n\n' +
                '       Parses the source code files at the src_dir, and outputs\n' +
                '           an app json at json_file_out.\n\n' +

                '    ./appmake.js compile <json_file> <output_dir>\n\n' +
                '       Compiles the app given by the json_file, and outputs\n' +
                '           a node app at the output_dir.\n\n' +

                '    ./appmake.js deploy <app_dir>\n\n' +
                '       Deploys the app in app_dir to the Appcubator cloud.\n\n';

    if (process.argv.length < 3) {
        process.stdout.write(USAGE);
        process.exit();
    }

    switch (process.argv[2]) {

        case "parse":
            if (process.argv.length < 5) {
                process.stdout.write("Not enough arguments for parse:\n");
                process.stdout.write(USAGE);
                break;
            }
            var srcDir = process.argv[3];
            var destJsonPath = path.resolve(process.argv[4]);
            if (fs.existsSync(destJsonPath)) {
                process.stdout.write("The path \""+destJsonPath+"\" already exists.");
                process.exit(1);
            }

            var app = parser.parseDir(srcDir);

            fs.writeFileSync(destJsonPath, JSON.stringify(app, null, 2));

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