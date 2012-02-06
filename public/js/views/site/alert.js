define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){

  var Model = Backbone.Model.extend({
  });

  var Collection = Backbone.Collection.extend({

      model: Model,

  });


  var AlertView = Backbone.View.extend({

    el: '#app',
  
    events: {
      //'submit form' : 'submit'
    },

    initialize: function(){
        _.bindAll(this, 'render'); 
        this.collection = new Collection;
    },

    render: function(msg_type, msg){
      
      if (this.collection.length > 0) 
        return  

      this.collection.add({alert: true})

      if (msg_type == 'error')
        var strong = '<strong>Heads up!</strong>';
      else
        var strong = '';
         
      var html = '<div class="alert alert-'+ msg_type + '">'
          html += strong + ' ';
          html += '<p>' + msg + '</p>'
          html += '</div>'
      var html  = $(html);
      $(this.el).after(html);
      $(html).center();
      return this; 
    },

  });
  
  return AlertView; 

});
