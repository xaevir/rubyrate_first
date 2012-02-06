define([
  'underscore', 
  'backbone',    
  'models/message'
], function(_, Backbone, Message){

    var Messages = Backbone.Collection.extend({
        url: '/messages',
        model: Message,
    });

  return Messages;

});
