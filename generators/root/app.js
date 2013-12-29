var generators = [];

generators.push({
    name: 'config',
    version: '0.1',
    code: function(data, templates) {
        return templates.main({customConfig: data.customCodeChunks.join("\n")});
    },
    templates: {
        'main': "#!/usr/bin/env node\n\
var express = require('express')\n\
  , http = require('http')\n\
  , path = require('path');\n\
\n\
\n\
var app = express();\n\
\n\
app.configure(function(){\n\
  app.set('port', process.env.PORT || 3000);\n\
  app.set('views', __dirname + '/views');\n\
  app.set('view engine', 'ejs');\n\
  app.use(express.logger('dev'));\n\
  // TODO decide on an official path for the favicon\n\
  // app.use(express.favicon());\n\
  app.use(express.bodyParser());\n\
  app.use(express.cookieParser('some secret'));\n\
  app.use(express.cookieSession());\n\
  // app.use(express.csrf());\n\
  app.use('/static', express.static(path.join(__dirname, 'public')));\n\
});\n\
\n\
app.configure('development', function(){\n\
  app.use(express.errorHandler());\n\
});\n\
\n\
<%= customConfig %>\n\
\n\
var routes = require('./routes');\n\
routes.bindTo(app);\n\
\n\
app.listen(app.get('port'));\n"
    }
});


exports.generators = generators;
