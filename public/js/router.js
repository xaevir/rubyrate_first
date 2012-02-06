// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/users/signup',
  'views/users/login',
  'views/site/navbar',
], function($, _, Backbone, SignupView, LoginView, Navbar){

  

  function showStatic(path) {
      $.get(path, function(obj) {
        $('#app').html(obj.body);
         document.title = obj.title;
      });
  };

    var Model = Backbone.Model.extend({ });

    var Collection = Backbone.Collection.extend({
        model: Model,
    });


  var AppRouter = Backbone.Router.extend({

      initialize: function(url) {
          _.bindAll(this, 'render', 'addOne'); 
      },


      routes: {
          '':               'index'
        , 'signup':         'signup'
        , 'login':          'login'
        //'*actions':     'defaultAction'
      }

    , index: function() { 
        showStatic('/'); 
        url.trigger("selected", "index");

      }

    , signup: function(){ 
        var view = new SignupView({'el': '#app', app_router: this})
        view.render();
        document.title = 'Sign Up';
      }

    , login: function(){ 
        var view = new LoginView({'el': '#app', app_router: this})
        view.render()
        document.title = 'Login';
      }
    
  });

  var initialize = function(url){
    var app_router = new AppRouter(url);
    Backbone.history.start({pushState: true});
    return app_router;
  };
  return {
    initialize: initialize
  };
});
