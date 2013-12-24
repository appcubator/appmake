#!/usr/bin/env node
var parser = require('./frontend/parser'),
    validator = require('./frontend/validator'),
    expander = require('./frontend/expander'),
    writer = require('./backend/writer'),
    fs = require('fs'),
    path = require('path'),
    restler = require('restler'),
    temp = require('temp'),
    tar = require('tar'),
    fstream = require('fstream');


if (parseFloat(process.version.substr(3)) < 10.21) {
    console.log('ERROR: Appmake is meant to use node version 0.10.21 or greater');
    process.exit(1);
}

if (require.main === module) {
    var USAGE = '\n  Usage:\n\n'+
                '    ./appmake.js parse <src_dir> <json_file_out>\n\n' +
                '       Parses the source code files at the src_dir, and outputs\n' +
                '           an app json at json_file_out.\n\n' +

                '    ./appmake.js compile <json_file> [output_dir]\n\n' +
                '       Compiles the app given by the json_file, and outputs\n' +
                '           a node app at the output_dir. Defaults to a temp dir.\n\n' +

                '    ./appmake.js deploy <app_dir> \n\n' +
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
            temp.track();
            if (process.argv.length < 4) {
                process.stdout.write("Not enough arguments for parse:\n");
                process.stdout.write(USAGE);
                break;
            }

            var appDir = process.argv[3];

            temp.mkdir('appmake-', function(err, dirPath) {
                var srcfstream = fstream.Reader({path:appDir, type:'Directory'});
                var pack = tar.Pack();
                var tmpfilepath = path.join(dirPath, 'code.tar');
                var destfstream = fstream.Writer(tmpfilepath);
                srcfstream.pipe(pack).pipe(destfstream);
                srcfstream.on('end', function(){
                    console.log(tmpfilepath);
                    fs.stat(tmpfilepath, function (err, stats) {
                        console.log(stats.size);
                        var r = restler.post('http://cloud.appcubator.com/api/deploy/', { multipart:true,
                                                                                          data: {code: restler.file(tmpfilepath, null, stats.size )}});
                        r.on('complete', function (body, response) {
                            console.log(body);
                        });
                        r.on('error', function(err){
                            console.log(err);
                        });

                    });


                });

            });
            break;

        default:
            process.stdout.write(USAGE);
            break;
    }
}
