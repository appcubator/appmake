exports.validate = function(){return [];};

// if value undefined, throws error to define the value called varName.
function assertExists(value, varName) {
    var valueType = typeof(value);
    var errorMsg = 'Please expose variable \'' + varName + '\'';
    if (valueType == typeof('undefined'))
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
        return true;
};
