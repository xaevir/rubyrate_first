define(function(require) {

var tpl = require('text!templates/reply.jade')
  , ReplyView = require('views/reply') 
  , MessagesView = require('views/messages') 
  , Collection = require('collections/messages')
  , RestrictedView = require('views/site/restricted')         

var ChatView = Backbone.View.extend({

  className: 'chat-unit',

  events: {
    'click .reply' : 'render_reply_form',
  },

  initialize: function(options) {
    _.bindAll(this, 'render', 'render_reply_form')
    this.message = options.message
    this.collection = new Collection(options.message)
    this.messagesView = new MessagesView({collection: this.collection})
  },

  render: function(){
    $el = $(this.el)
    $el.html(this.messagesView.render().el) 
    $el.append('<a href="#" class="reply">Reply</a><i class="bubble-lrg"></i><i class="bubble-sml"></i>')
    $el.addClass('wish-item')
    return this
  },

  render_reply_form: function(e){
    e.preventDefault()
    if (!window.user.get('username')) {
      return new RestrictedView(window.user).render()  
    }
    var opts = {
      replying_to: this.message,
      collection: this.collection, 
      user: window.user
    }
    var replyView = new ReplyView(opts)
    var form = replyView.render().el
    $(form).css('display', 'none')
    $(this.el).append(form)
    //movement
    $('i', this.el).fadeOut() 
    $('.reply', this.el).slideUp()
    $(form).slideDown()

  }
})
 
return ChatView

})
