define([
  'libs/hogan.js/web/builds/1.0.5/hogan-1.0.5.min.amd',
  '/bootstrap/js/bootstrap-alert.js'
], function(hogan){

  var AlertView = Backbone.View.extend({

    el: 'body',
  
    template: hogan.compile('\
      <div class="alert alert-{{type}}">\
        {{{message}}}\
       </div>'),


    events: {
      // twitter bootstrap handles these
    },

    initialize: function(options){
        options = options || {};
        this.message = options.message;
        this.type = options.type;
        this.timer = options.timer || false
        _.bindAll(this, 'render'); 
    },

    render: function(){
      var html = this.template.render({type: this.type, message: this.message});
      var html  = $(html);
      $(this.el).prepend(html);
      html.center();
      if(this.timer) {
        var t = setTimeout(function(){
          $('.alert').fadeOut('slow', function() {
            $('.alert').remove();
           });
        }, 3000);
      }
    },

  });
  
  return AlertView; 

});
