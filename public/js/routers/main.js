define(function(require) {

var SignupView = require('views/users/signup')
  , homeTpl = require('text!templates/home.jade')
  , LoginView = require('views/users/login')         
  , WishesNav = require('views/wishes/wishes_nav')
  , FulfillWishes = require('views/wishes/fulfill_wishes')
  , WishesCollection = require('collections/wishes')

return Backbone.Router.extend({

  initialize: function() {
    _.bindAll(this, 'signup', 'login', 'be-genie', 'logout'); 
    this.on('all', this.highlight)
    window.dispatcher.on('session:logout', this.logout, this)
  },

  routes: {
      '':               'home'
    , 'signup':         'signup'
    , 'login':          'login'
    , 'be-genie':       'be-genie' 
    //'*actions': his    'defaultAction'
  },

  home: function() { 
    if (window.user.isLoggedIn()) {
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
    }
    document.title = 'Ruby Rate' 
  },

  signup: function(){ 
    if (window.user.isLoggedIn()) 
      return this.navigate('/', true)
    if (!this.signupView) {
      this.signupView = new SignupView({context: 'main'})
      this.signupView.render();
    }
    $('#app').html(this.signupView.el);
    document.title = 'Sign Up';
  },

  login: function(){ 
    if (window.user.isLoggedIn()) 
      return this.navigate('/', true)
    /* would cache but its not resetting password field */
    this.loginView = new LoginView({context: 'main'})
    this.loginView.render()
    $('#app').html(this.loginView.el);
    document.title = 'Login';
  },

  logout: function(){
    console.log('router.logout.on->session:logout')
    $.ajax({
      type: "DELETE",
      url: "/session",
      success: function(){
        window.user.clear(); 
        var router = new Backbone.Router();
        router.navigate('login', {trigger: true})
      }
    });
  },

  'be-genie': function(e) {
    var that = this
    var collection = new WishesCollection()  
    collection.fetch({success: function(collection, res){
      var view = new FulfillWishes({collection: collection})
      $('#app').html(view.render().el);
      document.title = 'Be a Genie';
    }})
  },

  highlight: function(route, section) {
    route = route.replace('route:', '/');
    if (route === '/home') route = '/' 
    var hrefString = "a[href='" + route + "']"
    var el = $(hrefString);
    if (el.parent().hasClass('active')) 
        return;
    else {
        $('.navbar li.active').removeClass('active');
        var parent = el.parent(); 
        parent.addClass('active');
    }
  },

});
});
