define(function(require) {

var Router = require('router')
  , User = require('models/user')
  , NavBar = require('views/navbar/navbar')         
  , Alerts = require('collections/alerts')         
  , AlertView = require('views/site/alert')         
  , Session = require('models/session') 

  var initialize = function(){
     
    //window.alerts = new Alerts() 
    //window.alertView = new AlertView()     

    window.dispatcher = _.clone(Backbone.Events)

    window.user = new User()
    if (window.config.user)  
      window.user.set(window.config.user)
   
    var navBar = new NavBar()
    navBar.render()


    var router = new Router()
    router.session = new Session()
    Backbone.history.start({pushState: true});
  }

  return {
    initialize: initialize
  };
});
