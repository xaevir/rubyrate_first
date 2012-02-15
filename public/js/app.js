define(function(require) {

var Router = require('router')
  , NavBar = require('views/navBar')         
  , BodyView = require('views/site/body') 

  var initialize = function(){

    var user = new (Backbone.Model.extend({url: '/user'}))()
    var bodyView = new BodyView();

    NavBar.initialize(user);

    if (window.username)
      user.set({'username': window.username})

    //setting this last bc I am not using an event to render it
    Router.initialize(user);

  }

  return {
    initialize: initialize
  };
});
