define(function(require) {

var BodyView = Backbone.View.extend({

  el: 'body',

  initialize: function(options){
    _.bindAll(this, 'changePushState'); 
  },

  events: {
    //"click a": "changePushState"
    "click a:not(.no-push)": "changePushState"
  },

  changePushState: function(e) {
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

return BodyView 

});
