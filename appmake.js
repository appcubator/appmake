#!/usr/bin/env node
var parser = require('./frontend/parser'),
    validator = require('./frontend/validator'),
    expander = require('./frontend/expander'),
    writer = require('./backend/writer'),
    fs = require('fs'),
    path = require('path'),
    request = require('request'),
    temp = require("temp"),
    readline = require('readline');

/* TODO this is kinda out of place but I dont care at the moment */
function deploy(cb) {
    var r = request.post('http://cloud.appcubator.com/api/deployment/', function (error, response, body) {
        if (error) throw error;
        if (response.statusCode != 200) throw body;
        cb(body);
    });
    var form = r.form();
    // TODO fill in the proper api.
    form.append('my_field', 'my_value');
    form.append('my_buffer', new Buffer([1, 2, 3]));
    form.append('my_file', fs.createReadStream(path.join(__dirname, 'doodle.png')));
    form.append('remote_file', request('http://google.com/doodle.png'));
}

if (require.main === module) {
    var USAGE = '\n  Usage:\n\n'+
                '    ./appmake.js parse <src_dir> <json_file_out>\n\n' +
                '       Parses the source code files at the src_dir, and outputs\n' +
                '           an app json at json_file_out.\n\n' +

                '    ./appmake.js compile <json_file> [output_dir]\n\n' +
                '       Compiles the app given by the json_file, and outputs\n' +
                '           a node app at the output_dir. Defaults to a temp dir.\n\n' +

                '    ./appmake.js deploy <app_dir> [env_name]\n\n' +
                '       Deploys the app in app_dir to the Appcubator cloud (optionally in a specified environment).\n\n';

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
            break;

        case "compile":
            if (process.argv.length < 4) {
                process.stdout.write(USAGE);
                break;
            }
            var srcJsonFile = process.argv[3];
            var destPath = null; // signifies tempdir to writer fn
            if (process.argv.length == 5) destPath = process.argv[4];
            // TODO #{destPath} is not empty. Do you want to continue?

            var appJson = fs.readFileSync(srcJsonFile);
            var app = JSON.parse(appJson);

            // TODO validate structure and do static analysis
            var warnings = validator.validate(app);

            // expand the code generators
            expander.expandAll(app);

            if (destPath === null) {
                temp.mkdir('appmake-', function(err, tmpdir) {
                    destPath = tmpdir;
                    writer.write(app, destPath, function() { return process.stdout.write('Done: '+path.resolve(destPath)+'\n'); });
                });
            } else {
                writer.write(app, destPath, function() { return process.stdout.write('Done: '+path.resolve(destPath)+'\n'); });
            }

            break;

        case "deploy":
            if (process.argv.length < 4) {
                process.stdout.write("Not enough arguments for parse:\n");
                process.stdout.write(USAGE);
                break;
            }

            var appDir = process.argv[3];

            // assume dev environment unless the user specifies an environment. envs are TODO
            var environment = 'dev';
            if (process.argv.length >= 5) {
                var environment = process.argv[4];
            }

            if (!fs.existsSync(path.join(appDir, '.appID'))) {
                process.stdout.write('\nError: .appID file not found. To fix, please type the appID in a file called .appID (in your Appcubator app) and try again.');
                process.exit(1);
            }

            var appID = fs.readFileSync().trim(); // str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

            var rl = readline.createInterface({
              input: process.stdin,
              output: process.stdout
            });

            rl.question("This will deploy " + appID + " to the '" + envname + "' environment. Do you want to continue? [y/n]:", function(answer) {
                if (answer == 'y') {
                    deploy(function(body) {process.stdout.write('Success: \n' + body);});
                } else {
                    process.stdout.write('\nOk, have a good day!');
                }
                rl.close();
            });
            break;

        default:
            process.stdout.write(USAGE);
            break;
    }
}
