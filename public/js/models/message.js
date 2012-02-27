define(function(require) {

  var Message = Backbone.Model.extend({

    idAttribute: "_id",

    validation: {
      author:    {required: true},
      body:      {required: true, maxLength: 140},
      recipient: {required: true}
    }
  })

  return Message

})
