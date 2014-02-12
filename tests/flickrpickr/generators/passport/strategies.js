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
            "var User = require('./models/User').User;"+"\n"+
            "passport.use(new LocalStrategy({"+"\n"+
            "    usernameField: 'username',"+"\n"+
            "    passwordField: 'password'"+"\n"+
            "  },"+"\n"+
            "  function(username, password, done) {"+"\n"+
            "    User.findOne({ $or: [{ username: username }, { email: username }] }, function (err, user) {"+"\n"+
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
