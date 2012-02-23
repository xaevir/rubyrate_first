define(function(require) {
  var Wish = require('models/wish')

  var Wishes = Backbone.Collection.extend({
      url: '/be-genie',
      model: Wish,
  });

  return Wishes;

});
