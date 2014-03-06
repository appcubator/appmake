var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_ADDR || 'mongodb://localhost');
var Schema = mongoose.Schema;

//mongoose.connection.db.dropDatabase();

var pluginSchema = new Schema({
	name: String,
	description: String,
    modules: [{
        name: String,
        module: [{
            name: String,
            code: String,
            templates: [{
                name: String,
                value: String
            }]
        }]
    }],
});

var pluginModel = mongoose.model('Plugin', pluginSchema);

function buildPluginDbFromFile(genFileDir, init){
	if (init) pluginModel.collection.drop();

	console.log("Building plugin database...");
	var plugins = require(genFileDir);
	for (pkgName in plugins){
		for (moduleName in plugins[pkgName]){
			for (var i = 0; i < plugins[pkgName][moduleName].length; i++){
				var gen = plugins[pkgName][moduleName][i];
				for (prop in gen.templates) {console.log(prop);}
				var newPlugin = new pluginModel({
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
exports.Plugins = pluginModel;
