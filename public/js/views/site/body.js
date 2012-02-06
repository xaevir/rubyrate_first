define([
  'jquery',
  'underscore',
  'backbone',
  '/bootstrap/js/bootstrap-dropdown.js'
], function($, _, Backbone){

  var BodyView = Backbone.View.extend({

    initialize: function(options){
      $('.dropdown-toggle').dropdown()
      _.bindAll(this, 'allClicks'); 
      this.app_router = options.app_router;
    }

    , events: {
        "click a": "allClicks",
    }

    , allClicks: function(e){
        var link = $(e.currentTarget);
        var href = link.attr("href");
        href = href.toLowerCase();
        if(href.indexOf('http://')==0 || href.indexOf('www')==0){
          link.attr('target', '_blank');
          return 
        }
        e.preventDefault();
        this.app_router.navigate(href.substr(1), true)
    }
  });

  return BodyView 

});
