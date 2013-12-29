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

function validateGenrefOr(otherValidator) {
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
}

function validateRoute(route, locString) {
        assertType('string', route.method, locString+'.method');
        assertType('string', route.pattern, locString+'.pattern');
        assertType('function', route.code, locString+'.code');
}

function validateIM(im, locString) {
        assertType('string', im.name, locString+'.name');
        assertType('function', im.code, locString+'.code');
}

function validateSM(sm, locString) {
        assertType('string', sm.name, locString+'.name');
        assertType('function', sm.code, locString+'.code');
}

function validateModel(model, locString) {
        assertExists(model.fields, 'fields');
        assertExists(model.instancemethods, 'instancemethods');
        assertExists(model.staticmethods, 'staticmethods');
        assertType('string', model.name, locString+'.name');
        _.each(model.instancemethods, function(im){ validateGenrefOr(validateIM)(im, locString + '.instancemethods'); });
        _.each(model.staticmethods, function(sm){ validateGenrefOr(validateSM)(sm, locString + '.staticmethods'); });
}

// this is for the generator definition. see validateGenrefOr for the generator usage (aka ref)
function validateGenerator(generator, locString) {
        assertType('string', generator.name, locString+'.name');
        assertType('string', generator.version, locString+'.version');
        assertType('function', generator.code, locString+'.code');
        assertType('object', generator.templates, locString+'.templates');
        _.each(generator.templates, function(template, templateName) {
            assertType('string', templateName, locString+'.templates');
            assertType('string', template, locString+'.templates.'+templateName);
        });
}

/*
 * Often you want to validate that something is a generator ref or something else.
 * Ie, a generator ref in a routes array is still valid.
 *
 * Example:
 *     validator.validateGenrefOr(validateRoute)(route, 'routes.4');
 */
exports.validateGenrefOr = validateGenrefOr;
exports.validateRoute = validateRoute;
exports.validateIM = validateIM;
exports.validateSM = validateSM;
exports.validateModel = validateModel;
exports.validateGenerator = validateGenerator;
