define( function () {

  var Wish = Backbone.Model.extend({

    url: '/wishes',

    validation: {
      body: { required: true },
      postal_code: { required: true },
      urgence: { required: true }
    },
    /* initialize: function(){ this.bind("change", this.attributesChanged); }, attributesChanged: function(){ var valid = false; if (this.get('body') && this.get('postal_code') && this.get('urgence')) valid = true; this.trigger("validated", valid); } */ 
  });

   return Wish;

});
