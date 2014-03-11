exports.root = require('./root/generators');
exports.crud = require('./crud/generators');
exports.userauth = require('./userauth/generators');

// turn code from function to string
var stringalize = function(plugin) {
    for (var m in plugin) {
        if (m === 'metadata') continue;
        for (var i = 0; i < plugin[m].length; i++) {
            plugin[m][i].code = plugin[m][i].code.toString();
        }
    }
};

stringalize(exports.root);
stringalize(exports.crud);
stringalize(exports.userauth);
