define(function(require) {

  var Message = Backbone.DeepModel.extend({

    idAttribute: "_id",

    validation: {
      author:    {required: true},
      body:      {required: true, maxLength: 140},
      kickoff_id:   {required: true}
    }
  })

  return Message

})
