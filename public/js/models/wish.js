define(function(require) {

  var Wish = Backbone.Model.extend({

    idAttribute: "_id",

    url: '/wishes',

    validation: {
      author:      {required: true},
      body:        {required: true, maxLength: 160},
      postal_code: {required: true},
      urgence:     {required: true}
    }
  })

  return Wish

})
