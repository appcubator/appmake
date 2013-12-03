#!/usr/bin/env node
var express = require('express')
  , http = require('http')
  , path = require('path');


var app = express();

app.configure(function(){
  /* TODO may want to consider moving this to the app state for customizability */
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger('dev'));
  // TODO decide on an official path for the favicon
  // app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.cookieParser('some secret'));
  app.use(express.cookieSession());
  // app.use(express.csrf());
  // TODO this should be optional, just wanna confirm.
  // app.use(app.router);
  app.use('/static', express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var routes = require('./routes');
routes.bindTo(app);

app.listen(app.get('port'));
