define(function(require) {

var AlertView = require('views/site/alert')
  , hogan = require('libs/hogan.js/web/builds/1.0.5/hogan-1.0.5.min.amd')

var Model = Backbone.Model.extend()

var Collection = Backbone.Collection.extend({
  model: Model,
  url: '/conversations',
})


var ItemView = Backbone.View.extend({

  tagName:  "li",

  template: hogan.compile('<a href="/conversations/{{_id}}">{{label}}</a>'),

  events: {
  },

  initialize: function() {
    //this.model.bind('change', this.render, this);
  },

  render: function() {
    var _id = this.model.get('_id')
    var body = this.model.get('body')
    if (body.length > 50) {  
      var body = body.substr(0, 50) 
      body = body + '...'
    }
    var template = this.template.render({_id: _id, label: body});
    $(this.el).html(template);
    return this;
  },

});


var ListView = Backbone.View.extend({

  className: 'nav nav-list',

  events: {
  },

  initialize: function() {
    this.collection = new Collection()
    this.collection.bind('reset', this.addAll, this)
    this.collection.fetch()
  },

  addOne: function(model) {
    var view = new ItemView({model: model});
    $(this.el).append(view.render().el)
  },

  // Add all items in the **Todos** collection at once.
  addAll: function() {
    this.collection.each(this.addOne, this);
  },
})

return ListView

})
