var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_ADDR || 'mongodb://localhost');
var Schema = mongoose.Schema;

//mongoose.connection.db.dropDatabase();

var generatorSchema = new Schema({
	packageName: String,
	moduleName: String,
	author: String,
	description: String,
	name: String,
	version:  String,
	code: String,
	templates: {}
});

var generatorModel = mongoose.model('Generator', generatorSchema);

function buildGeneratorDbFromFile(genFileDir, init){
	if (init) generatorModel.collection.drop();

	console.log("Building generator database...");
	var generators = require(genFileDir);
	for (pkgName in generators){
		for (moduleName in generators[pkgName]){
			for (var i = 0; i < generators[pkgName][moduleName].length; i++){
				var gen = generators[pkgName][moduleName][i];
				for (prop in gen.templates) {console.log(prop);}
				var newGenerator = new generatorModel({
					name: gen.name,
					moduleName: moduleName,
					description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut libero nibh, accumsan id enim eu, consequat porta odio. Praesent vitae aliquet lacus.",
					packageName: pkgName,
					author: 'Appcubator',
					version: gen.version,
					code: gen.code.toString(),
					templates: gen.templates
				});
				newGenerator.save(function (err){
					if (err) console.log(err);
				});
			}
		}
	}
	console.log("Done!");
}

buildGeneratorDbFromFile('../public/generators/generators.js', true);
exports.Generators = generatorModel;
