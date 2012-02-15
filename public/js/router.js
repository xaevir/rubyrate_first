define(function(require) {

var SignupView = require('views/users/signup')
  , homeTpl = require('text!templates/home.jade')
  , LoginView = require('views/users/login')         
  , WishesNav = require('views/wishes_nav')
  , FulfillWishes = require('views/wishes/fulfill_wishes')

/*
function showStatic(path) {
  $.get(path, function(obj) {
    $('#app').html(obj.body)
    document.title = obj.title
  })
}
*/
var Router = Backbone.Router.extend({

  initialize: function(options) {
    this.user = options.user;
    _.bindAll(this, 'signup', 'login'); 
  },

  routes: {
      '':               'home'
    , 'signup':         'signup'
    , 'login':          'login'
    , 'fulfill-wishes': 'fulfill-wishes' 
    //'*actions': his    'defaultAction'
  },

  home: function() { 
    if (this.user.get('username')) {
      $('.container').addClass('container-fluid').removeClass('container')         
      $('#app').html('<div class="row-fluid"><div class="span3"><div class="sidebar-nav"></div></div></div>')
      var wishesNav = new WishesNav()
      $('.sidebar-nav').html(wishesNav.el)
    }
    else {
        if (!this.template) {
          this.template = jade.compile(homeTpl)()
        }
      $('#app').html(this.template)
      document.title = 'Ruby Rate' 
    }
  },

  signup: function(){ 
    if (!this.view) {
      this.view = new SignupView({user: this.user, context: 'main'})
      this.view.render();
    }
    $('#app').html(this.view.el);
    document.title = 'Sign Up';
  },

  login: function(){ 
    if (!this.view) {
      this.view = new LoginView({user: this.user})
      this.view.render()
    }
    $('#app').html(this.view.el);
    document.title = 'Login';
  },

  'fulfill-wishes': function(e) {
    var view = new FulfillWishes()
    view.on("domReady", function() {
      $('#app').html(view.el);
    });
    document.title = 'Fulfill Wishes';
  },

});


Router.prototype.bind('all ', function(route, section) {
  route = route.replace('route:', '/');
  if (route == '/home') 
    var el = $('#home') // have 2 home links, logo and home
  else {
    var href = "a[href='" + route + "']"
    var el = $(href);
  }
  // If current route is highlighted, we're done.
  if (el.parent().hasClass('active')) 
      return;
  else {
      // Unhighlight active tab.
      $('.navbar li.active').removeClass('active');
      // Highlight active page tab.
      var parent = el.parent(); 
      parent.addClass('active');
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
