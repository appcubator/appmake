var expander = require('./frontend/expander');
var writer = require('./backend/writer');

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
// POST [ app.generators, {generate:'blah', data:{blah} ]
app.post('/expandOnce/', function(req, res){
    var argv = req.body;
    res.json(expander.expandOnce(argv[0], argv[1]));
});

// expand a generator completely
// POST [ app.generators, {generate:'blah', data:{blah} ]
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
    expander.doPostExpandMagic(app);
    var codeData = writer.produceCode(app);
    res.json(codeData);
});

exports.run = function(port) {
    app.listen(port);
};
