var generators = [];

generators.push({
    name: 'create',
    version: '0.1',
    defaults: {
      enableAPI: true
    },
    code: function(data, templates){
        var method = { name: 'create'+data.modelName,
                       code: templates.code() };
        if (data.enableAPI) method.enableAPI = true;
        return method;
    },
    templates: {'code':"function (data, callback) {\n"+
                       "    // Calls the mongoose create method of this model. Add validation logic here.\n"+
                       "    return this.create(data, callback);\n" +
                       "}"}
});

generators.push({
    name: 'find',
    version: '0.1',
    defaults: {
      enableAPI: true
    },
    code: function(data, templates){
        var method = { name: 'find'+data.modelName,
                       code: templates.code() };
        if (data.enableAPI) method.enableAPI = true;
        return method;
    },
    templates: {'code':"function (conditions, callback) {\n"+
                       "    // Calls the mongoose find method of this model. Add validation logic here.\n"+
                       "    return this.find(conditions, callback);\n" +
                       "}"}
});

generators.push({
    name: 'update',
    version: '0.1',
    defaults: {
      enableAPI: true
    },
    code: function(data, templates){
        var method = { name: 'update'+data.modelName,
                       code: templates.code() };
        if (data.enableAPI) method.enableAPI = true;
        return method;
    },
    templates: {'code':"function (conditions, update, callback) {\n"+
                       "    // Calls the mongoose find method of this model. Add validation logic here.\n"+
                       "    return this.findOneAndUpdate(conditions, update, callback);\n" +
                       "}"}
});

exports.generators = generators;
