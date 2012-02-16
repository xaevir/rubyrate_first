define(function(require) {

  var Reply = Backbone.Model.extend({

    url: '/replies',

    validation: {
      author:    {required: true},
      body:      {required: true},
      recipient: {required: true}
    }
  })

  return Reply

})
