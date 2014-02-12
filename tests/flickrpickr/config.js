var config = {
    generate: "app.config",
    data: {
        customCodeChunks:[{ generate: 'passport.config.basic', data: {}},
                          { generate: 'passport.strategies.local', data: {}}]
    }
};
