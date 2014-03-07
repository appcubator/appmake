var mongoose = require('mongoose'),
    _ = require('underscore');
mongoose.connect(process.env.MONGO_ADDR || 'mongodb://localhost');
var Schema = mongoose.Schema;

//mongoose.connection.db.dropDatabase();

var pluginSchema = new Schema({
	name: String,
	description: String,
    modules: [{
        name: String,
        generators: [{
            name: String,
            code: String,
            templates: [{
                name: String,
                value: String
            }]
        }]
    }],
});

var jsonToPlugin = function(json) {
    var plugin = {};
    plugin.name = json.metadata.name;
    plugin.description = json.metadata.description;
    plugin.modules = [];
    // convert the modules from one format to the other
    _.each(json, function(generators, moduleName) {
        if (moduleName === 'metadata') return;

        var newGens = [];
        plugin.modules.push({
            name: name,
            generators: newGens
        });

        _.each(generators, function(gen) {
            var newGen = JSON.parse(JSON.stringify(gen)); // deepcopy
            newGen.templates = [];
            _.each(gen.templates, function(template, name) {
                newGen.templates.push({
                    name: name,
                    value: template
                });
            });
            newGens.push(newGen);
        });
    });
    return plugin;
};

var pluginToJson = function(plugin) {
    var json = {};
    json.metadata = {
        name: plugin.name,
        description: plugin.description
    };
    _.each(plugin.modules, function(module) {
        json[module.name] = JSON.parse(JSON.stringify(module.generators));
        _.each(json[module.name], function(gen) {
            var newTemps = {};
            _.each(gen.templates, function(t) {
                newTemps[t.name] = t.value;
            });
            gen.templates = newTemps;
        });

    });
    return json;
};

/*
 * Creates and returns a Plugin, given a js object in normal JSON form.
 * */
pluginSchema.statics.fromJSON = function(json) {
    var p = new Plugin(jsonToPlugin(json));
};

var Plugin = mongoose.model('plugins', pluginSchema);

function buildPluginDbFromFile(genFileDir, init){
	if (init) Plugin.collection.drop();

	console.log("Building plugin database...");
	var plugins = require(genFileDir);
	for (pkgName in plugins){
		for (moduleName in plugins[pkgName]){
			for (var i = 0; i < plugins[pkgName][moduleName].length; i++){
				var gen = plugins[pkgName][moduleName][i];
				for (prop in gen.templates) {console.log(prop);}
				var newPlugin = new Plugin({
					name: gen.name,
					moduleName: moduleName,
					description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut libero nibh, accumsan id enim eu, consequat porta odio. Praesent vitae aliquet lacus.",
					packageName: pkgName,
					author: 'Appcubator',
					version: gen.version,
					code: gen.code.toString(),
					templates: gen.templates
				});
				newPlugin.save(function (err){
					if (err) console.log(err);
				});
			}
		}
	}
	console.log("Done!");
}

buildPluginDbFromFile('../plugins/plugins.js', true);
exports.Plugins = Plugin;
