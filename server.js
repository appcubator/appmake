var expander = require('./frontend/expander').init(),
    postExpand = require('./frontend/postExpand'),
    fs = require('fs'),
    _ = require('underscore'),
    writer = require('./backend/writer');

var path = require('path');
var Plugin = require('./models/Plugin').Plugin;

var less = require('less');

var express = require('express'),
    cors = require('cors');

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.use('/client/app/', express.static(path.join(__dirname, 'client', 'app')));
	app.use(express.favicon(path.join(__dirname, 'client', 'app', 'favicon.ico')));
	app.use(express.logger('dev'));
	
	app.use(express.bodyParser());
	app.use(express.methodOverride());
});

app.options('*', cors()); // include before other routes


/*
 * Notes:
 *  -Below, app.plugins refers to an array of the local app generators. For simple testing, an empty array is sufficient.
 *  -The request bodies should be JSON strings.
 *  -Make sure to set the following HTTP Header
 *      Content-Type: application/json
 *
 * */



// perform one expansion of a generator
// POST [ app.plugins, {generate:'blah', data:{blah} ]
app.post('/expandOnce/', function(req, res){
    var argv = req.body;
    res.json(expander.expandOnce(argv[0], argv[1]));
});

// expand a generator completely
// POST [ app.plugins, {generate:'blah', data:{blah} ]
app.post('/expand/', function(req, res){
    var argv = req.body;
    res.json(expander.expand(argv[0], argv[1]));
});

// expand all the generators in the app completely
// POST where request body is app json string.
app.post('/expandAll/', function(req, res){
    var app = req.body;
    res.json(expander.expandAll(app));
});

// expand and compile an app down to code
// POST where request body is app json string.
app.post('/compile/', function(req, res){
    var app = req.body;
    expander.expandAll(app);
    postExpand.doPostExpandMagic(app, function(){
        var codeData = writer.produceCode(app);
        res.json(codeData);
    });
});

// compile some less to css
// GET where request body is urlencoded less=lesscodehere.
app.get('/less/', function(req, res){
    var lessCode = req.body.less;
    less.render(lessCode, function(e, css){
        if (e) res.send(500, e);
        else res.send(css);
    });
});


/* Generator DB Routes */

app.get('/', function (req, res){
    fs.readFile(path.join(__dirname, 'client', 'app', 'index.html'), function(err, data) {
        if (err) throw err;
        data = data.toString().replace(/\{\{ STATIC_URL \}\}/g, process.env.STATIC_URL || '/client/app/');
        data = data.replace(/\{\{ SITE_STATIC_URL \}\}/g, process.env.SITE_STATIC_URL || 'http://127.0.0.1:8000/static/');
        res.send(data);
    });
});

app.get('/plugins/list', cors(), function (req, res) {
	Plugin.find({}, function (err, gens) {
		if (err) {
            console.log(err);
		}
        var unique = {};
        for (var i = 0; i < gens.length; i++){
            var pName = gens[i].name;
            if (unique[pName] === undefined){
                unique[pName] = gens[i];
            } else {
                oldGen = unique[pName];
                if (parseFloat(oldGen.version) < parseFloat(gens[i].version)){
                    unique[pName] = gens[i];
                }
            }
        }
		res.json(_.map(unique, function(g) { return g.toNormalJSON(); }));
	});
});

app.post("/plugins/create", cors(), function (req, res) {

    console.log("Yo wassup!!");


    var p = Plugin.fromJSON(req.body);

    Plugin.findOne({ name: p.name }, function (err, oldP){
        if (err) throw err;
        if (oldP) {
            res.status = 409;
            res.json({success: false, message: "Plugin already exists", plugin: oldP.toNormalJSON()});
        } else {
            p.save(function (err, data){
                if (err) {
                    console.log("Error...");
                    res.json({success: false, error: err});
                } else {
                    var j = {};
                    j.plugin = p.toNormalJSON();
                    j.success = true;
                    res.json(j);
                    res.status = 201;
                }
            });
        }
    });
});

app.get("/plugins/:pname", cors(), function (req, res) {

    Plugin.find({}, function (err, plugins){
    });

    Plugin.find({ name: req.params.pname }, function (err, plugins){
        if (err) throw err;
        if (plugins !== undefined && plugins.length > 0) {
            var latestVersion = 0;
            var latesti = 0;
            for (var i = 0; i < plugins.length; i++){
                var v = parseFloat(plugins[i].version);
                if (v > latestVersion) {
                    latestVersion = v;
                    latesti = i;
                }
            }
            res.json(plugins[latesti].toNormalJSON());
        } else {
            res.status = 404;
            res.json({success: false});
        }
    });
});


function incrementVersion(v){
    var nums = v.split(".");
    nums[nums.length-1] = (parseInt(nums[nums.length-1]) + 1).toString();
    return nums.join(".");
}


app.post("/plugins/update", cors(), function (req, res) {
    var p;
    try {
        p = Plugin.fromJSON(req.body);
    }
    catch (e) {
        res.json({ success: false, message: "Failed to parse plugin"});
    }
    Plugin.find({ name: p.name }, function (err, plugins){
        if (err) throw err;
        if (plugins) {
            var latestVersion = 0;
            var latesti = 0;
            for (var i = 0; i < plugins.length; i++){
                var v = parseFloat(plugins[i].version);
                if (v > latestVersion) {
                    latestVersion = v;
                    latesti = i;
                }
            }
            p.version = incrementVersion(plugins[latesti].version);
            p.save(function (err, data){
                if (err) throw err;
                res.status = 201;
                res.json({ success: true, plugin: p.toNormalJSON()});
            });
        } else {
            res.status = 404;
            res.json({ success: false});
        }
    });
});

app.post("/plugins/destroy", cors(), function (req, res) {
    Plugin.remove({ name: req.body.pname, version: req.body.version }, function (err, oldP){
        if (err) throw err;
        else {
            res.end('ok');
        }
    });
});


exports.run = function(port) {
    app.listen(port);
};
