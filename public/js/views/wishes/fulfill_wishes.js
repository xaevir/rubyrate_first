define(function(require) {

var AlertView = require('views/site/alert')
  , hogan = require('libs/hogan.js/web/builds/1.0.5/hogan-1.0.5.min.amd')         
    
var Model = Backbone.Model.extend()

var Collection = Backbone.Collection.extend({
  model: Model,
  url: '/fulfill-wishes',
})


var ItemView = Backbone.View.extend({

  tagName:  "li",
  className: 'wish-item',

  template: hogan.compile('<a href="#"><blockquote>{{body}}</blockquote><span class="reply"></span></a>'),

  events: {
  },

  initialize: function() {
    //this.model.bind('change', this.render, this);
  },

  render: function() {
    var body = this.model.get('body')
    if (body.length > 160) {  
      var body = body.substr(0, 160) 
      body = body + '...'
     }
    var template = this.template.render({body: body});
    $(this.el).html(template);
    return this;
  },

});


var ListView = Backbone.View.extend({

  className: 'wishes row',
  tagName: 'ul',

  events: {
  },

  initialize: function() {
    $(this.el).append('<div class="span4 col1">')
    $(this.el).append('<div class="span4 col2">')
    $(this.el).append('<div class="span4 col3">')
    this.collection = new Collection()
    this.collection.bind('reset', this.addAll, this)
    this.collection.fetch()
  },

  changeCounter: function(){
    this.counter += 1
    if (this.counter > 3 ) this.counter = 1;
    return this.counter
  },

  counter: 1,

  addOne: function(model, index) {
    var view = new ItemView({model: model});
    var colClass = '.col' + this.counter
    $(colClass, this.el).append(view.render().el)
    this.changeCounter()
  },

  // Add all items in the **Todos** collection at once.
  addAll: function() {
    this.collection.each(this.addOne, this);
    this.trigger("domReady");
  },
})

return ListView

})
