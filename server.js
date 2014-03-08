var expander = require('./frontend/expander').init(),
    postExpand = require('./frontend/postExpand'),
    fs = require('fs'),
    _ = require('underscore'),
    writer = require('./backend/writer');

var less = require('less');

var express = require('express'),
    cors = require('cors');
var app = express();
app.use(express.bodyParser());



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
var path = require('path');
var Plugin = require('./models/Plugin').Plugin;

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.use('/client/app', express.static(path.join(__dirname, 'client', 'app')));
	app.use(express.favicon(path.join(__dirname, 'client', 'app', 'favicon.ico')));
	app.use(express.logger('dev'));
	
	app.use(express.bodyParser());
	app.use(express.methodOverride());
});

app.get('/', function (req, res){
    fs.readFile(path.join(__dirname, 'client', 'app', 'index.html'), function(err, data) {
        if (err) throw err;
        data = data.toString().replace(/\{\{ STATIC_URL \}\}/g, process.env.STATIC_URL || '/client/app');
        res.send(data);
    });
});

app.options('*', cors()); // include before other routes
app.get('/plugins/list', cors(), function (req, res) {
	Plugin.find({}, function (err, gens) {
		if (err) {
			console.log(err);
		}
		res.json(_.map(gens, function(g) { return g.toNormalJSON(); }));
	});
});

app.get('/plugins/:pkg', function (req, res){
	Plugin.findOne({
		name: req.params.pkg,
	}, function (err, gen) {
        gen = gen.toNormalJSON();
		res.json(gen);
	});
});

app.post('/plugins/:pkg/:mdl/:gen/update', function(req, res) {
    // TODO add authorization
    var gen = req.body;
    Plugin.findOne()
    p.save(function(err, data) {
        if (err) throw err;
        res.end('ok');
    });
});

app.put('/plugins/publish', function(req, res) {
    // TODO add authorization
    var plugin = req.body;
    var p = Plugin.jsonToPlugin(plugin);
    p.save(function(err, data) {
        if (err) throw err;
        res.end('ok');
    });
});


exports.run = function(port) {
    app.listen(port);
};
