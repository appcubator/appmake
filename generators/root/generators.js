exports.routes = require('./routes.js').generators;
exports.templates = require('./templates.js').generators;
exports.uielements = require('./uielements.js').generators;
exports.models = require('./models.js').generators;
exports.app = require('./app.js').generators;
exports.metadata = {
    name: 'root',
    description: 'stuff thats just chilling',
    displayName: 'Simple Elements'
};
