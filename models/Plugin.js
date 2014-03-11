var mongoose = require('mongoose'),
    _ = require('underscore');
mongoose.connect(process.env.MONGO_ADDR || 'mongodb://localhost');
var Schema = mongoose.Schema;

// mongoose.connection.db.dropDatabase();

var pluginSchema = new Schema({
	name: String,
    version: String,
	description: String,
    modules: [{
        name: String,
        generators: [{
            name: String,
            code: String,
            templates: [{
                name: String,
                value: String
            }],
            defaults: Schema.Types.Mixed,
            displayProps: Schema.Types.Mixed
        }]
    }],
});

var jsonToPlugin = function(json) {
    var plugin = {};
    plugin.name = json.metadata.name;
    plugin.version = json.metadata.version;
    plugin.description = json.metadata.description;
    plugin.modules = [];
    // convert the modules from one format to the other
    _.each(json, function(generators, moduleName) {
        if (moduleName === 'metadata') return;

        var newGens = [];
        plugin.modules.push({
            name: moduleName,
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
        version: plugin.version,
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
            gen.version = '0.1';
        });
    });
    return json;
};

/*
 * Creates and returns a Plugin, given a js object in normal JSON form.
 * */
pluginSchema.statics.fromJSON = function(json) {
    var p = new Plugin(jsonToPlugin(json));
    return p;
};
pluginSchema.methods.toNormalJSON = function() {
    var j = pluginToJson(this.toObject());
    return j;
};

var Plugin = mongoose.model('plugins', pluginSchema);

function buildPluginDbFromFile(genFileDir, init){
	if (init) Plugin.collection.drop();

	console.log("Building plugin database...");
	var plugins = require(genFileDir);

    _.each(plugins, function(p) {

        _.each(p, function(generators, moduleName) {
            if (moduleName === 'metadata') return;
            _.each(generators, function(gen) {
                gen.code = gen.code.toString();
            });
        });
        var newPlugin = Plugin.fromJSON(p);
        newPlugin.description = "Lorem Ipsum"
        newPlugin.version = "0.1"
        newPlugin.save(function (err){
            if (err) console.log(err);
        });
    });
	console.log("Done!");
}

buildPluginDbFromFile('../generators/generators.js', true);
exports.Plugin = Plugin;
