var expander = require('./frontend/expander');

var express = require('express');
var app = express();
app.use(express.bodyParser());


// perform one expansion of a generator
app.post('/expandOnce/', function(req, res){
    var argv = req.body;
    res.json(expander.expandOnce(argv[0], argv[1]));
});

// expand a generator completely
app.post('/expand/', function(req, res){
    var argv = req.body;
    res.json(expander.expand(argv[0], argv[1]));
});

// expand all the generators in the app completely
app.post('/expandAll/', function(req, res){
    var app = req.body;
    res.json(expander.expandAll(app));
});

exports.run = function(port) {
    app.listen(port);
};
