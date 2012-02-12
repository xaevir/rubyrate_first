define([
  'libs/hogan.js/web/builds/1.0.5/hogan-1.0.5.min.amd',
  'views/users/signup',
], function(hogan){

  var Model = Backbone.Model.extend({
  });

  var Collection = Backbone.Collection.extend({

      model: Model,

      toggleSelected: function(model){
        var old = this.find(function(model) {return model.has('selected')});
        if (old) old.unset('selected'); // none set yet
        model.set({selected: true});
      },
  });

  var baseCollection = new Collection(
    [
      {label: 'Home', href: '/', id: 'home', content: 'static'},
      {label: 'Contact', href: '/contact' }
    ]
  );

  var loggedout = new Collection([
    {label: 'Sign Up', href: '/signup', content: function(){
        var view = new SignupView({'el': '#app', app_router: this})
        view.render();
        document.title = 'Sign Up';
    }},
    {label: 'Login',   href: '/login'}
  ]);

  var loggedin = new Collection([
    {label: 'Logout', href: '/logout'},
  ]);



  var ItemView = Backbone.View.extend({

      template: hogan.compile('<a href="{{href}}" id="{{id}}">{{label}}</a>'),

      tagName: 'li',

      events: {
          "click a": "clicked"
      },

      initialize: function(options) {
          _.bindAll(this, 'render', 'clicked'); 
          this.model.on("change:selected", this.highlight, this);
      },

      clicked: function(e){
        e.preventDefault();
        if (this.model.has('selected')) return; 
        this.model.collection.toggleSelected(this.model);
      },

      render: function() {
        var html = this.template.render(this.model.toJSON());
        $(this.el).append(html);
        return this;
      },

      highlight: function(model, selected){
        if (selected === true) 
          $(this.el).addClass('active');
        else
          $(this.el).removeClass('active');
      },
  });

  var ListView = Backbone.View.extend({
  
    initialize: function(options) {
        _.bindAll(this, 'render', 'addToDom'); 
        this.LinkRouter = options.LinkRouter;
    },
    render: function() {
        this.collection.each(this.addToDom, this);//need to render first
        this.collection.each(this.addRouter, this);//need to render first
        return this;
    },
    addToDom: function(model){
        var view = new ItemView({model: model});
        view.render();
        $(this.el).append(view.el);
       },
    addRouter: function(model){
      var href = model.get('href').substr(1);
      var routes = {}; 
      routes[href] = 'defaultAction'
      new this.LinkRouter({model: model, routes: routes})   
    }
  });


  var LinkRouter = Backbone.Router.extend({

      initialize: function(options) {
        this.model = options.model; 
        _.bindAll(this, 'defaultAction'); 
        this.model.on("change:selected", this.defaultAction, this);
      },

     defaultAction: function(e){
       if (this.model.has('selected')) return; 
       this.model.collection.toggleSelected(this.model)     
       if (this.model.get('content') == 'static')
         this.showStatic(this.model.get('href'));
       else {
         var fn = this.model.get('content')
         fn();
       } 
     },

     showStatic: function(path) {
       $.get(path, function(obj) {
         $('#app').html(obj.body);
           document.title = obj.title;
         });
       },
  });

  var initialize = function(user){

    var listView = new ListView({
        el: '.nav-base'
      , collection: baseCollection
      , LinkRouter: LinkRouter
    });

    user.on('change', function(){

      var context =  this.get('username') ? loggedin : loggedout;

      var userView = new ListView({
           el: '.nav-user'
        , collection: context 
        , LinkRouter: LinkRouter
      });   
      userView.render();
    });

    listView.render();
    Backbone.history.start({pushState: true});

  };

  return {
    initialize: initialize
  };

});  
