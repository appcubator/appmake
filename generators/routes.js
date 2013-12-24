var generators = [];

generators.push({
    name: 'staticpage',
    version: '0.1',
    code: function(data, templates){
        var route = {
            "method": "GET",
            "pattern": data.url,
            "code": templates.code({ templateName: data.templateName })
        };
        return route;
    },
    templates: {'code':"function (req, res) {"+"\n"+
                       "    res.render('<%= templateName %>');"+"\n"+
                       "}"}
});
