var expander = require('./frontend/expander').init(),
    postExpand = require('./frontend/postExpand'),
    writer = require('./backend/writer');

var less = require('less');

var express = require('express');
var app = express();
app.use(express.bodyParser());



/*
 * Notes:
 *  -Below, app.generators refers to an array of the local app generators. For simple testing, an empty array is sufficient.
 *  -The request bodies should be JSON strings.
 *  -Make sure to set the following HTTP Header
 *      Content-Type: application/json
 *
 * */



// perform one expansion of a generator
// POST [ app.plugins, app.generators, {generate:'blah', data:{blah} ]
app.post('/expandOnce/', function(req, res){
    var argv = req.body;
    res.json(expander.expandOnce(argv[0], argv[1], argv[2]));
});

// expand a generator completely
// POST [ app.plugins, app.generators, {generate:'blah', data:{blah} ]
app.post('/expand/', function(req, res){
    var argv = req.body;
    res.json(expander.expand(argv[0], argv[1], argv[2]));
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
var GeneratorModel = require('./models/Generator.js').Generators;

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.favicon());
	app.use(express.logger('dev'));
	
	app.use(express.bodyParser());
	app.use(express.methodOverride());
});

app.get('/', function (req, res){
    res.sendfile( __dirname + '/client/app/index.html' );
});

app.get( '/client/*' , function (req, res, next) {
    var file = req.params[0]; 
    res.sendfile( __dirname + '/client/' + file );
});

app.get( '/public/*' , function (req, res, next) {
    var file = req.params[0]; 
    res.sendfile( __dirname + '/public/' + file );
});

app.get('/generators/list', function (req, res) {
	GeneratorModel.find({}, function (err, gens) {
		if (err) {
			console.log(err);
		}
		res.json(gens);
	});
});

app.get('/generators/:pkg/:mdl/:gen', function (req, res){
	GeneratorModel.findOne({
		packageName: req.params.pkg,
		moduleName: req.params.mdl,
		name: req.params.gen
	}, function (err, gen) {
		if (err) {
			console.log(err);
		}
		res.json(gen);
	});
});


exports.run = function(port) {
    app.listen(port);
};
