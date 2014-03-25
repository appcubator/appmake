/* plz edit via plugin editor and reserialize as follows. */

exports.uielements = [{"templates":{"html":"<form id=\"<%= id %>\" class=\"<%= className %>\" style=\"<%= style %>\">\n<%= formFields %>\n<br>\n<input type=\"submit\" value=\"Submit\"><br>\n</form>","js":"$('#<%= id %>').submit(function(e){\n    e.preventDefault();\n    var email = $('#<%= id %> input[name=\"email\"]').val();\n    var password1 = $('#<%= id %> input[name=\"password1\"]').val();\n    var password2 = $('#<%= id %> input[name=\"password2\"]').val();\n\n    $('#<%= id %>').attr('disabled','true');\n\n    models.User.signup(email, password1, password2, function(err, data){\n\n        $('#<%= id %>').attr('disabled','false');\n\n        if (err) {\n            alert(err);\n        } else {\n            location.href = '<%= redirect_to %>';\n        }\n\n    });\n\n    return false;\n});"},"_pristine":false,"code":"function (data, templates) {\n    // expect data.redirect_to\n    var fields = [];\n    fields.push({\n        generate: 'uielements.form-field',\n        data: { displayType: 'single-line-text',\n                field_name: 'email',\n                placeholder: 'Email'}\n    });\n    fields.push({\n        generate: 'uielements.form-field',\n        data: { displayType: 'password-text',\n                field_name: 'password1',\n                placeholder: 'Password'}\n    });\n    fields.push({\n        generate: 'uielements.form-field',\n        data: { displayType: 'password-text',\n                field_name: 'password2',\n                placeholder: 'Confirm password'}\n    });\n    data.formFields = _.map(fields, expand).join('<br>');\n    return { html: templates.html(data), js: templates.js(data), css: ''};\n}","name":"signup","package":"authentication","generatorIdentifier":"authentication.uielements.signup","version":"0.1","defaults":{"className":"","style":"","id":"","redirect_to":""}},{"templates":{"html":"<form id=\"<%= id %>\" class=\"<%= className %>\" style=\"<%= style %>\">\n<%= formFields %>\n<br>\n<input type=\"submit\" value=\"Submit\"><br>\n</form>","js":"$('#<%= id %>').submit(function(e){\n    e.preventDefault();\n    var email = $('#<%= id %> input[name=\"email\"]').val();\n    var password = $('#<%= id %> input[name=\"password\"]').val();\n\n    $('#<%= id %>').attr('disabled','true');\n\n    models.User.login(email, password, function(err, data){\n\n        $('#<%= id %>').attr('disabled','false');\n\n        if (err) {\n            alert(err);\n        } else {\n            location.href = '<%= redirect_to %>';\n        }\n\n    });\n\n    return false;\n});"},"code":"function (data, templates) {\n    // expect data.redirect_to\n    var fields = [];\n    fields.push({\n        generate: 'uielements.form-field',\n        data: { displayType: 'single-line-text',\n                field_name: 'email',\n                placeholder: 'Email'}\n    });\n    fields.push({\n        generate: 'uielements.form-field',\n        data: { displayType: 'password-text',\n                field_name: 'password',\n                placeholder: 'Password'}\n    });\n    data.formFields = _.map(fields, expand).join('<br>');\n    return { html: templates.html(data), js: templates.js(data), css: ''};\n}","version":"0.1","defaults":{"className":"","style":"","id":"","redirect_to":""},"name":"login"}];
exports.model_methods = [{"templates":{"code":"function(plainText) {\n  /**\n   * Authenticate by checking the hashed password and provided password\n   *\n   * @param {String} plainText\n   * @return {Boolean}\n   * @api private\n   */\n    return this.encryptPassword(plainText) === this.hashed_password;\n  }"},"generatorIdentifier":"authentication.model_methods.authenticate","code":"function(data, templates) {\n    return {\n        name: 'authenticate',\n        instancemethod:true,\n        code: templates.code(data)\n    };\n}","version":"0.1","name":"authenticate"},{"templates":{"code":"function() {\n  /**\n   * Create password salt\n   *\n   * @return {String}\n   * @api private\n   */\n\n    /* Then to regenerate password, use:\n        user.salt = user.makeSalt()\n        user.hashed_password = user.encryptPassword(password)\n    */\n    return Math.round((new Date().valueOf() * Math.random())) + '';\n  }"},"generatorIdentifier":"authentication.model_methods.makeSalt","code":"function(data, templates) {\n    return {\n        name: 'makeSalt',\n        instancemethod:true,\n        code: templates.code(data)\n    };\n}","version":"0.1","name":"makeSalt"},{"templates":{"code":"function (password) {\n  /**\n   * Encrypt password\n   *\n   * @param {String} password\n   * @return {String}\n   * @api private\n   */\n    var crypto = require('crypto');\n    if (!password) return '';\n    return crypto.createHmac('sha1', this.salt).update(password).digest('hex')\n  }"},"generatorIdentifier":"authentication.model_methods.encryptPassword","code":"function(data, templates) {\n    return {\n        name: 'encryptPassword',\n        instancemethod:true,\n        code: templates.code(data)\n    };\n}","version":"0.1","name":"encryptPassword"},{"templates":{"code":"function (token, cb) {\n  /**\n   * Reset auth token\n   *\n   * @param {String} token\n   * @param {Function} cb\n   * @api private\n   */\n    var self = this;\n    var crypto = require('crypto');\n    crypto.randomBytes(48, function(ex, buf) {\n      self[token] = buf.toString('hex');\n      if (cb) cb();\n    });\n  }"},"generatorIdentifier":"authentication.model_methods.resetToken","code":"function(data, templates) {\n    return {\n        name: 'resetToken',\n        instancemethod:true,\n        code: templates.code(data)\n    };\n}","version":"0.1","name":"resetToken"},{"templates":{"code":"function (schema) {\n  schema.path('name').validate(function (name) {\n    return name.trim().length > 0;\n  }, 'Please provide a valid name');\n}"},"generatorIdentifier":"authentication.model_methods.validateName","code":"function(data, templates) {\n    return {\n        name: 'validateName',\n        schemaMod:true,\n        code: templates.code(data)\n    };\n}","version":"0.1","name":"validateName"},{"templates":{"code":"function (schema) {\n  schema.path('email').validate(function (email) {\n    return email.trim().length > 0;\n  }, 'Please provide a valid email');\n}"},"generatorIdentifier":"authentication.model_methods.validateEmail","code":"function(data, templates) {\n    return {\n        name: 'validateEmail',\n        schemaMod:true,\n        code: templates.code(data)\n    };\n}","version":"0.1","name":"validateEmail"},{"templates":{"code":"function (schema) {\n  schema.path('hashed_password').validate(function (hashed_password) {\n    return hashed_password.length > 0;\n  }, 'Please provide a password');\n}"},"generatorIdentifier":"authentication.model_methods.validatePassword","code":"function(data, templates) {\n    return {\n        name: 'validatePassword',\n        schemaMod:true,\n        code: templates.code(data)\n    };\n}","version":"0.1","name":"validatePassword"},{"templates":{"code":"function(email, username, password, password2, callback) {\n        if (password !== password2) {\n            callback('Passwords don\\'t match. Please try again.');\n        }\n        var user = new this({email: email, username: username});\n        user.salt = user.makeSalt();\n        user.hashed_password = user.encryptPassword(password);\n        user.save(function(err, data) {\n            if (err) {\n                callback(err);\n            } else {\n                callback(null, {url:'?success=true'});\n            }\n        });\n    }"},"generatorIdentifier":"authentication.model_methods.signup","code":"function(data, templates) {\n    return {\n        name: 'signup',\n        enableAPI:true,\n        code: templates.code(data)\n    };\n}","version":"0.1","name":"signup"},{"templates":{"code":"function(username, password, callback, _req, _res) {\n        /* Fake it to look like a form submission */\n  _req.body.username = username;\n  _req.body.password = password;\n  var passport = require('passport');\n  passport.authenticate('local', function(err, user, info) {\n    if (err) {\n      return callback(err);\n    }\n    if (!user) {\n      return callback(null, { redirect: '/login' });\n    }\n    _req.logIn(user, function(err) {\n      if (err) {\n        return callback(err);\n      }\n      return callback(null, { redirect: '/users/' + user.username });\n    });\n  })(_req, _res);\n}"},"generatorIdentifier":"authentication.model_methods.login","code":"function(data, templates) {\n    return {\n        name: 'login',\n        enableAPI:true,\n        code: templates.code(data)\n    };\n}","version":"0.1","name":"login"}];
exports.metadata = {
    name: 'userauth',
    displayName: 'User Auth',
    description: 'generates some code to support user authentication.'
    };