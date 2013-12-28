var generators = [];

generators.push({
    name: 'proxyToMongoose',
    version: '0.1',
    code: function(data, templates){
        var method = { name: data.methodName+data.modelName,
                       code: templates.code(data) };
        if (data.enableAPI) method.enableAPI = true;
        return method;
    },
    templates: {'code':"function () {"+"\n"+
                       "    var args = Array.prototype.slice.call(arguments);" + "\n" +
//                       "    console.log(this.<%= methodName %>);" + "\n" +
//                       "    console.log(args);" + "\n" +
                       "    return this.<%= methodName %>.apply(this, args);" + "\n" +
                       "}"}
});

exports.generators = generators;
