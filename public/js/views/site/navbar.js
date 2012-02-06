define([
  'jquery',
  'underscore',
  'backbone',
  'libs/hogan.js/web/builds/1.0.5/hogan-1.0.5.min.amd'
], function($, _, Backbone, hogan){

  var Model = Backbone.Model.extend({
  });

  var Collection = Backbone.Collection.extend({
      model: Model
  });

//  debugger;

  var nav = {};

  var baseCollection = new Collection(
    [
      {label: 'Home',    href: '/'},
      {label: 'Contact', href: '/contact' }
    ]
  );


  var loginCollection = new Collection(
    [
      {label: 'Sign Up', href: '/signup'},
      {label: 'Login',   href: '/login'}
    ] 
  );
  

  var ItemView = Backbone.View.extend({

        template: hogan.compile('<a href="{{href}}">{{label}}</a>'),

        tagName: 'li', 

        initialize: function(){
            _.bindAll(this, 'render'); 
        },

        render: function(){
            var html = this.template.render(this.model.toJSON());
            $(this.el).html(html);
            return this; 
        },
  });

  var ListView = Backbone.View.extend({
  
        initialize: function(opts) {
            _.bindAll(this, 'render', 'addOne', 'selected'); 
            this.options.url.on('selected', this.selected)
        },

        selected: function(path){
           
        
        },

        render: function() {
            this.collection.each(this.addOne, this);
            return this;
        },

        addOne: function(model){
            var view = new ItemView({model: model});
            view.render();
            $(this.el).append(view.el);
        },
    });


  var initialize = function(url){
    var listView = new ListView({el: '.nav-base', collection: baseCollection, url: url});
    listView.render();
  }

  return {
    initialize: initialize
  };

});  
