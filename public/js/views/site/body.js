define([
  '/bootstrap/js/bootstrap-dropdown.js'
], function(){

  var BodyView = Backbone.View.extend({

    el: 'body',

    initialize: function(options){
      $('.dropdown-toggle').dropdown();
      _.bindAll(this, 'changePushState'); 
    }

    , events: {
        //"click a[href='/']": "changePushState"
    }

    , dontChangePushState: function(e){
        var link = $(e.currentTarget);
        var href = link.attr("href");
        href = href.toLowerCase();
        if(href.indexOf('http://') === 0 || href.indexOf('www') === 0){
          link.attr('target', '_blank');
          return;
        }
        e.preventDefault();
        var router = new Backbone.Router();
        router.navigate(href.substr(1), true)
    }

    , changePushState: function(e) {
        var link = $(e.currentTarget);
        var href = link.attr("href");
        href = href.toLowerCase();
        if(href.indexOf('http://') === 0 || href.indexOf('www') === 0){
          link.attr('target', '_blank');
          return;
        }
        e.preventDefault();
        var router = new Backbone.Router();
        router.navigate(href.substr(1), true)

    
    }



  });

  var initialize = function(){
    new BodyView();
  };

  return {
    initialize: initialize
  };
});
