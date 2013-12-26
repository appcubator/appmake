var _ = require("underscore");

// if value undefined, throws error to define the value called varName.
function assertExists(value, varName) {
    var valueType = typeof(value);
    var errorMsg = 'Please expose variable \'' + varName + '\'';
    if (valueType == typeof(undefined))
        throw errorMsg;
}

// pass the type, value to be the type, and locString which is just some string to help with debugging location of the error.
function assertType(typeString, value, locString) {
    var valueType = typeof(value);
    var errorMsg = 'Found: "' + valueType + '", expected "' + typeString + '" (' + value + ' in ' + locString + ')';
    if (valueType != typeString)
        throw errorMsg;
}

exports.assertExists = assertExists;
exports.assertType = assertType;

exports.validateRoute = function(route, locString) {
        assertType('string', route.method, locString+'.method');
        assertType('string', route.pattern, locString+'.pattern');
        assertType('function', route.code, locString+'.code');
        route.code = route.code.toString();
};

// this is for the generator definition. see validateGenrefOr for the generator usage (aka ref)
exports.validateGenerator = function(generator, locString) {
        assertType('string', generator.name, locString+'.name');
        assertType('string', generator.version, locString+'.version');
        assertType('function', generator.code, locString+'.code');
        generator.code = generator.code.toString();
        assertType('object', generator.templates, locString+'.templates');
        _.each(generator.templates, function(template, templateName) {
            assertType('string', templateName, locString+'.templates');
            assertType('string', template, locString+'.templates.'+templateName);
        });
};

/*
 * Often you want to validate that something is a generator ref or something else.
 * Ie, a generator ref in a routes array is still valid.
 *
 * Example:
 *     validator.validateGenrefOr(validateRoute)(route, 'routes.4');
 */
exports.validateGenrefOr = function(otherValidator) {
    var v = function(obj, locString) {
        // is a generator? then return. else try to validate otherValidator.
        try {
            assertType('string', obj.generate, locString+'.generate');
            assertType('object', obj.data, locString+'.data');
        } catch (genrefInvalid) {
            return otherValidator(obj, locString);
        }
    };
    return v;
};
