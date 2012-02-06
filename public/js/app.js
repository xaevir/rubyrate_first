define([
  'jquery', 'underscore', 'backbone', 'router', 
  'views/site/body',
  'views/site/navbar',
  'libs/utilities'
], function($, _, Backbone, Router, BodyView, Navbar, utilities){
  var initialize = function(){

    var url = {};

    _.extend(url, Backbone.Events);

    Navbar.initialize(url);
  
    var app_router = Router.initialize(url);

    new BodyView({el: 'body', app_router: app_router});
  }

  return {
    initialize: initialize
  };
});
