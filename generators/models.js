var generators = [];

generators.push({
    name: 'proxyToMongoose',
    version: '0.1',
    code: function(data, templates){
        var method = { name: data.methodName+data.modelName,
                       code: templates.code(data) };
        return method;
    },
    templates: {'code':"function () {"+"\n"+
                       "    var args = Array.prototype.slice.call(arguments);" + "\n" +
                       "    return <%= modelName %>.<%= methodName %>.apply(null, args);" + "\n" +
                       "}"}
});

exports.generators = generators;
