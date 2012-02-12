define([
  'router', 
  'views/navBar',
  'views/site/body',
  'bootstrap/js/bootstrap-dropdown.js'
], function(Router, NavBar, BodyView){
  var initialize = function(){

    var user = new Backbone.Model;
    user.url = '/user';
    user.fetch();
    
    BodyView.initialize();
    NavBar.initialize(user);
    Router.initialize(user);


  }

  return {
    initialize: initialize
  };
});
