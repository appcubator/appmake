var fields = [{
        "name": "name",
        "type": "String"
    },
    {
        "name": "email",
        "type": "String"
    },
    {
        "name": "username",
        "type": "String"
    },
    {
        "name": "hashed_password",
        "type": "String"
    },
    {
        "name": "salt",
        "type": "String"
    }];

var instancemethods = [];

instancemethods.push({
  name: 'authenticate',
  code: function(plainText) {
  /**
   * Authenticate by checking the hashed password and provided password
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api private
   */
    return this.encryptPassword(plainText) === this.hashed_password;
  }
});

instancemethods.push({
  name: 'makeSalt',
  code: function() {
  /**
   * Create password salt
   *
   * @return {String}
   * @api private
   */

    /* Then to regenerate password, use:
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    */
    return Math.round((new Date().valueOf() * Math.random())) + '';
  }
});

instancemethods.push({
  name: 'encryptPassword',
  code: function (password) {
  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api private
   */
    var crypto = require('crypto');
    if (!password) return '';
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  }
});


instancemethods.push({
  name: 'resetToken',
  code: function (token, cb) {
  /**
   * Reset auth token
   *
   * @param {String} token
   * @param {Function} cb
   * @api private
   */
    var self = this;
    var crypto = require('crypto');
    crypto.randomBytes(48, function(ex, buf) {
      self[token] = buf.toString('hex');
      if (cb) cb();
    });
  }
});

var schemaMods = [];
schemaMods.push(function (schema) {
  schema.path('name').validate(function (name) {
    return name.trim().length > 0;
  }, 'Please provide a valid name');
});

schemaMods.push(function (schema) {
  schema.path('email').validate(function (email) {
    return email.trim().length > 0;
  }, 'Please provide a valid email');
});

schemaMods.push(function (schema) {
  schema.path('hashed_password').validate(function (hashed_password) {
    return hashed_password.length > 0;
  }, 'Please provide a password');
});


var staticmethods = [];

staticmethods.push({
    name: 'signup',
    enableAPI:true,
    code: function(username, password, password2, callback) {
        if (password !== password2) {
            callback('Passwords don\'t match. Please try again.');
        }
        var user = new this({username: username});
        user.salt = user.makeSalt();
        user.hashed_password = user.encryptPassword(password);
        user.save(function(err, data) {
            if (err) {
                callback(err);
            } else {
                callback(null, {url:'?success=true'});
            }
        });
    }
});

var model = { generate: "models.model",
              data: {
                  name: 'User',
                  fields: fields,
                  instancemethods: instancemethods,
                  staticmethods: staticmethods,
                  schemaMods: schemaMods
              }
};

