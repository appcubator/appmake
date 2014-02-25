var fields = [{ name: "datePicked",
                type: "Date" },
              { name: "name",
                type: "String" },
              { name: "url",
                type: "String" }
];

var functions = [];
functions.push({
  name: 'randomNFromFlickr',
  enableAPI: true,
  code: function(searchQ, limit, cb) {
      var flickr = require('flickr');
      var fcli = new flickr.Flickr('cbe3f7f6cbf9d13ad243a1e1afec902d', '5c3f9a33e088ef60');
      fcli.executeAPIRequest('flickr.photos.search', {text: searchQ, per_page: limit, extras: ['url_q']},
                               false, function(e, d){cb(e, d);});
    }
});

/* example of instancemethod */
functions.push({
  name: 'updateUrl',
  instancemethod: true,
  code: function(newUrl, cb) {
      this.url = newUrl;
      this.save(function(e, d){cb(e,d);});
    }
});

functions.push({
  name: 'updateUrl',
  enableAPI: true,
  code: function(pic, newUrl, callback, _req, _res) {
      if (_req.query.test === 'true') {
          _res.send('pristine');
      } else {
          this.findOne({id:pic.id}, function(err, pic){
              pic.updateUrl(newUrl, function(e, d) {
                 callback(e, d);
              });
          });
      }
    }
});

functions.push({
    generate: 'crud.model_methods.create',
    data: { modelName: 'Picture',
            enableAPI: true, }
});

functions.push({
    generate: 'crud.model_methods.find',
    data: { modelName: 'Picture',
            enableAPI: true, }
});

var model = { generate: "models.model",
              data: {
                  name: 'Picture',
                  fields: fields,
                  functions: functions
              }
};
