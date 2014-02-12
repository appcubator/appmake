var generators = [];
generators.push({
    name: 'basic',
    version: '0.1',
    code: function(data, templates) {
        return templates.code(data);
    },
    templates: {
        code: "// configure app to use passport middleware"+"\n"+
            "(function(){"+"\n"+
            "var passport = require('passport');"+"\n"+
            "app.use(passport.initialize());"+"\n"+
            "app.use(passport.session());"+"\n\n"+
            "passport.serializeUser(function(user, done) {"+"\n"+
            "      done(null, user);"+"\n"+
            "});"+"\n"+
            ""+"\n"+
            "passport.deserializeUser(function(user, done) {"+"\n"+
            "      done(null, user);"+"\n"+
            "});"+"\n" +
            "})();"

}
});
