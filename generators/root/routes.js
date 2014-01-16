var generators = [];

generators.push({
    name: 'staticpage',
    version: '0.1',
    code: function(data, templates){
        /* Data should be an object with keys:
        *   name : string, url : array */
        var route = {
            "method": "GET",
            "pattern": '/' + data.url.join('/'),
            "code": templates.code({ name: data.name })
        };
        return route;
    },
    templates: {'code':"function (req, res) {"+"\n"+
                       "    res.render('<%= name %>');"+"\n"+
                       "}"}
});

generators.push({
    name: 'apiroute',
    version: '0.1',
    code: function(data, templates){
        // TODO allow custom url and method.
        var url = '/api/' + data.modelName + '/' + data.methodName;
        var route = {
            "method": "POST",
            "pattern": url,
            "code": templates.code(data)
        };
        return route;
    },
    templates: {'code': "function (req, res) {"+"\n"+
                "    var <%= modelName %> = require('./models/<%= modelName %>').<%= modelName %>;"+"\n"+
                "    var whenDone = function(e, d) { res.send({error:e, data:d}); };"+"\n"+
                "    var args = req.body;"+"\n"+
                "    args.push(whenDone);"+"\n"+
                "    <%= modelName %>.<%= methodName %>.apply(<%= modelName %>, args);"+"\n"+
                "}"}
});

exports.generators = generators;
