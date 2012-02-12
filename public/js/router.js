// Filename: router.js
define([
  'views/users/signup',
  'views/users/login',
], function(SignupView, LoginView, Navbar){

  

  function showStatic(path) {
      $.get(path, function(obj) {
        $('#app').html(obj.body);
         document.title = obj.title;
      });
  };

    var Model = Backbone.Model.extend({ });

    var Collection = Backbone.Collection.extend({ model: Model,
    });


  var Router = Backbone.Router.extend({

      initialize: function(options) {
        this.user = options.user;
        _.bindAll(this, 'signup', 'login'); 
      },

      routes: {
          '':               'index'
        , 'signup':         'signup'
        , 'login':          'login'
        //'*actions': his    'defaultAction'
      }

    , index: function() { 
        showStatic('/'); 
      }
 
    , signup: function(){ 
        //if (document.referrer == '')
        var view = new SignupView({user: this.user, context: 'main'})
        $('#app').html(view.render().el);
        document.title = 'Sign Up';
      }

    , login: function(){ 
        var view = new LoginView({'el': '#app', user: this.user})
        view.render()
        document.title = 'Login';
      }
    
  });


  Router.prototype.bind('all ', function(route, section) {
      route = route.replace('route:', '/');
       
      if (route == '/index') 
        var el = $('#home') // have 2 home links, logo and home
      else 
        var el = $('a[href="' + route + '"]');

      // If current route is highlighted, we're done.
      if (el.hasClass('active')) 
          return;
      else {
          // Unhighlight active tab.
          $('.navbar li.active').removeClass('active');
          // Highlight active page tab.
          el.parent().addClass('active');
      }
  });

  var initialize = function(user){
    new Router({user: user});
    Backbone.history.start({pushState: true});
  };

  return {
    initialize: initialize
  };
});
