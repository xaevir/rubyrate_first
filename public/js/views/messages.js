define(function(require) {

//var hogan = require('libs/hogan.js/web/builds/1.0.5/hogan-1.0.5.min.amd')         
//  , Reply = require('models/reply') 

var MessageItem = Backbone.View.extend({

  tagName:  "li",
  className: 'message-item',

  //template: hogan.compile('<blockquote>{{body}}</blockquote> <a href="#" class="reply">Reply</a> '),

  initialize: function() {
    _.bindAll(this, 'render');
  },

  render: function() {
    var body = this.model.get('body')
    var template = this.template.render({body: body});
    $(this.el).html(template);
    return this;
  },

})


var ListView = Backbone.View.extend({

  className: 'messages',  
  tagName: 'ul',

  events: {
 //   'click .reply' : 'create_wish',
  },

  initialize: function() {
    _.bindAll(this, 'render');
    this.collection.bind('add', this.addOne, this)
    //this.collection.fetch()
  },

  counter: 1,

  addOne: function(model, index) {
    var body = model.get('body')
    var $el = $('<li>' + body + '</li>' )
    if (!(this.counter % 2))
      $el.addClass('even')
    $(this.el).append($el)
    this.counter += 1
  },

  // Add all items in the **Todos** collection at once.
  render: function() {
    this.collection.each(this.addOne, this);
    return this
  },
})

return ListView

})
