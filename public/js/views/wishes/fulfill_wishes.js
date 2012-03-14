define(function(require) {

var AlertView = require('views/site/alert')
  , hogan = require('libs/hogan.js/web/builds/1.0.5/hogan-1.0.5.min.amd')         
  , ChatView = require('views/chat')         
  , RestrictedView = require('views/site/restricted')         
  , MessagesView = require('views/messages')         
    

return Backbone.View.extend({

  className: 'wishes row',  

  tagName: 'ul',

  initialize: function(options) {
    _.bindAll(this)
    $(this.el).append('<div class="span4 col1">')
    $(this.el).append('<div class="span4 col2">')
    $(this.el).append('<div class="span4 col3">')
  },

  changeCounter: function(){
    this.counter += 1
    if (this.counter > 3 ) this.counter = 1;
    return this.counter
  },

  counter: 1,

  addOne: function(model, index) {
    var view = new ChatView({message: model, user: this.user});
    var colClass = '.col' + this.counter
    $(colClass, this.el).append(view.render().el)
    this.changeCounter()
  },

  // Add all items in the **Todos** collection at once.
  render: function() {
    this.collection.each(this.addOne, this);
    return this
  },
})

})
