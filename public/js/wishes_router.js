define(function(require) {

//var SignupView = require('views/users/signup')
//  , homeTpl = require('text!templates/home.jade')


var Router = Backbone.Router.extend({

  routes: {
    , 'wishes/:id':         'showWish'
    //'*actions': his    'defaultAction'
  },

  showWish: function(id) { 
    
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
