define(function(require) {

  var User = Backbone.Model.extend({
    
    validation: {
      _id: { required: true },
      username: {required: true}
    }
  })

  return User

})
