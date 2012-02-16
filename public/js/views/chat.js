define(function(require) {

var tpl = require('text!templates/reply.jade')
  , ReplyView = require('views/reply') 
  , MessagesView = require('views/messages') 


var Model = Backbone.Model.extend()

var Collection = Backbone.Collection.extend({
  model: Model,
  url: '/messages',
})

var ChatView = Backbone.View.extend({

  className: 'chat-area',

  initialize: function(options) {
    _.bindAll(this, 'render')
    var messages = new Collection(options.first_message_model)
    this.messagesView = new MessagesView({collection: messages})
    this.replyView = new ReplyView({reply_to: options.first_message_model, collection: messages})
  },

  render: function() {
    $(this.el).html(this.messagesView.render().el) 
    $(this.el).append(this.replyView.render().el)
    return this
  },

  transformation: function(){
  
  
  }


})
 
return ChatView

})
