#!/usr/bin/env node
var parser = require('./frontend/parser'),
    validator = require('./frontend/validator'),
    expander = require('./frontend/expander').init(),
    postExpander = require('./frontend/postExpand'),
    writer = require('./backend/writer'),
    fs = require('fs'),
    path = require('path'),
    restler = require('restler'),
    temp = require('temp'),
    tar = require('tar'),
    _ = require('underscore'),
    fstream = require('fstream'),
    mkdirp = require('mkdirp'),
    util = require("util"),
    sys = require('sys'),
    http = require('http'),
    exec = require('child_process').exec;

// Child process; 
var child;
  



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

                '    ./appmake.js runserver \n\n' +
                '       Runs an HTTP Server at port 3000\n\n'+

                '    ./appmake.js deploy <app_dir> \n\n' +
                '       Deploys the app in app_dir to the Appcubator cloud.\n\n' + 

                '    ./appmake.js plugin install [name || repo@github.com] <json_file> \n\n' +
                '       Installs an Appcubator plugin into the current app, recompiles the app.\n\n';


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
            // uncomment below to demo expand steps
            // expander.expandAll(app);
            // postExpander.doPostExpandMagic(app);

            fs.writeFileSync(destJsonPath, JSON.stringify(app, function(key, value) {
                if (typeof(value) === 'function')
                    return value.toString();
                else
                    return value;
            }, 2));
            process.stdout.write('Parsed: '+path.resolve(destJsonPath)+'\n');
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
            postExpander.doPostExpandMagic(app, function(){

                if (destPath === null) {
                    temp.mkdir('appmake-', function(err, tmpdir) {
                        destPath = tmpdir;
                        writer.write(app, destPath, function() { return process.stdout.write('Compiled: '+path.resolve(destPath)+'\n'); });
                    });
                } else {
                    writer.write(app, destPath, function() { return process.stdout.write('Compiled: '+path.resolve(destPath)+'\n'); });
                }

            });

            break;

        case "runserver":
            var server = require("./server");
            server.run(parseInt(process.argv[3] || '3000'));
            break;


        case "plugin":
            switch (process.argv[3]) {
                case "create":
                    if (process.argv.length < 5){
                        console.log("Not enough arguments. USAGE: appmake plugin create <name>");
                    } else {
                        createPluginsDir(process.argv[4]);
                    }
                    break;
                case "install":
                    process.stdout.write("Plugin: Installing plugin in /plugins/...\n");
                    
                    if (process.argv.length < 5){
                        console.log("Not enough arguments. USAGE: appmake plugin install <name>");
                        return;
                    }

                    var local = true;
                    var host = local ? "127.0.0.1" : "productionServer";
                    var port = 3000;
                    var path = "/plugins/" + process.argv[4]; 
//                    Get the address of the plugin
                    var options = {
                      method: "GET",
                      host: host,
                      port: port,
                      path: path
                    };
                    callback = function(response) {
                      var str = '';
                      //another chunk of data has been recieved, so append it to `str`
                      response.on('data', function (chunk) {
                        str += chunk;
                      });

                      //the whole response has been recieved, so we just print it out here
                      response.on('end', function () {
                        console.log(str);
                      });
                    }

                    http.get(options, callback).end();

                    break

                case "publish":
                    process.stdout.write("Publish the plugin...");

                    // Parse directory and turn it into a plugin object.




                case "uninstall":
                    process.stdout.write("Plugin: Uninstalling plugin... \n");                               
                    // Remove the plugin source code from x.json

                    break





                case "enable":
                    break;

            }
            if (process.argv.length < 4){
                process.stdout.write("Not enough arguments for plugin:\n");
                process.stdout.write(USAGE);
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


    



function makeStartPlugin(pluginName){

    var pluginNameDir = path.join(".", "plugins", pluginName);
    console.log("- Creating new plugin in ", pluginNameDir);


    var mdls = ["uielements", "routes", "models"];

    var err;
    for (var i = 0; i < mdls.length; i++){
        var mdlDir = path.join(pluginNameDir, mdls[i]);
        err = fs.mkdirSync(mdlDir);
        if (err){
            console.log(error);
        } else {

            var genName = "gen";
            var genDir = path.join(mdlDir, genName)

            err = fs.mkdirSync(genDir);
            if (err){
                console.log(error);
            } else {


                var codeFileDir = path.join(genDir, "code.js");
                var defaultsDir = path.join(genDir, "defaults.json");
                var templatesDir = path.join(genDir, "templates");


                var err = fs.mkdirSync(templatesDir);
                if (err){
                    console.log(error)
                }

                fs.writeFile(path.join(templatesDir, "simple"), "<h1> Hey there! </h1>", function(err) {
                    if(err) {
                        console.log(err);
                    }
                }); 

                fs.writeFile(codeFileDir, "Hey there!", function(err) {
                    if(err) {
                        console.log(err);
                    }
                }); 

                fs.writeFile(defaultsDir, "Hey there!", function(err) {
                    if(err) {
                        console.log(err);
                    }
                }); 





            }






        }
    } 



}


function createPluginsDir(pluginName){

    var err = fs.mkdir("./plugins", function (err){
        fs.mkdir(path.join(".", "plugins", pluginName), function (err){
            if (err){
                console.log("Error: This plugin already exists. Use 'appmake update <name>' to update your plugins.");
            } else {
                makeStartPlugin(pluginName);
            }    
        });
    });

    return null;
}






function cloneFromGitIntoDirectory(githubAddress, pluginName){


    return null;
}


    // Make a new directory with the given name and init a git repo. 



    // Create the template directory

    // 
