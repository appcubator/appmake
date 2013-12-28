var generators = [];

generators.push({
    name: 'create',
    version: '0.1',
    code: function(data, templates){
        var method = { name: 'create'+data.modelName,
                       code: templates.code() };
        if (data.enableAPI) method.enableAPI = true;
        return method;
    },
    templates: {'code':"function (data, callback) {\n"+
                       "    // Calls the mongoose method of this model. Add validation logic here.\n"+
                       "    return this.create(data, callback);\n" +
                       "}"}
});

exports.generators = generators;
