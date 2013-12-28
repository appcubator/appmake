var fields = {
  "datePicked": "Date",
  "name": "String",
  "url": "String"
};

var instancemethods = [];
instancemethods.push({
  name: 'updateUrl',
  enableAPI: true,
  code: function(newUrl, cb) {
      this.url = newUrl;
      this.save(function(e, d){cb(e,d);});
    }
});

var staticmethods = [];
staticmethods.push({
  name: 'randomNFromFlickr',
  enableAPI: true,
  code: function(searchQ, limit, cb) {
      var flickr = require('flickr');
      var fcli = new flickr.Flickr('cbe3f7f6cbf9d13ad243a1e1afec902d', '5c3f9a33e088ef60');
      fcli.executeAPIRequest('flickr.photos.search', {text: searchQ, per_page: limit, extras: ['url_q']},
                               false, function(e, d){cb(e, d);});
    }
});

/* Pretend the user wants these exposed as methods...,
 * How do instancemethods get transported?
 *
 * Remote call, method and ID. findById, then call method with arguments.
 * If it's save instancemethod, we may be able to use create on the backend. */

staticmethods.push({
    generate: 'models.create',
    data: { modelName: 'Picture',
            enableAPI: true, }
});

staticmethods.push({
    generate: 'models.find',
    data: { modelName: 'Picture',
            enableAPI: true, }
});

var model = {fields: fields,
             instancemethods: instancemethods,
             staticmethods: staticmethods};
