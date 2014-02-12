var generators = [];
generators.push({
    name: 'local',
    version: '0.1',
    code: function(data, templates) {
        return templates.code(data);
    },
    templates: {
        code: "// use local strategy"+"\n"+
            "(function(){"+"\n"+
            "var passport = require('passport');"+"\n"+
            "var LocalStrategy = require('passport-local').Strategy;"+"\n"+
            "var User = require('./models/User').Strategy;"+"\n"+
            "passport.use(new LocalStrategy({"+"\n"+
            "    usernameField: 'email',"+"\n"+
            "    passwordField: 'password'"+"\n"+
            "  },"+"\n"+
            "  function(email, password, done) {"+"\n"+
            "    User.findOne({ email: email }, function (err, user) {"+"\n"+
            "      if (err) { return done(err) }"+"\n"+
            "      if (!user) {"+"\n"+
            "        return done(null, false, { message: 'Unknown user' })"+"\n"+
            "      }"+"\n"+
            "      if (!user.authenticate(password)) {"+"\n"+
            "        return done(null, false, { message: 'Invalid password' })"+"\n"+
            "      }"+"\n"+
            "      return done(null, user)"+"\n"+
            "    })"+"\n"+
            "  }"+"\n"+
            "));"+"\n"+
            "})();"

    }
});
