define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/users/login.jade',
  'views/site/alert',
  'libs/jade/jade',
  'libs/jquery-validation/jquery.validate',
], function($, _, Backbone, tpl, AlertView){

  var Model = Backbone.Model.extend({ 
    url: '/login',
    
    rules: {
      email: {
        required: true,
      },
      password: {
        required: true,
      },
    }
  });

  var LoginView = Backbone.View.extend({

    template: jade.compile(tpl),

    events: {
      //'submit form' : 'submit'
    },

    initialize: function(){
        _.bindAll(this, 'render', 'submitHandler', 'xhr'); 
        this.model = new Model;
        this.alert = new AlertView()
    },

    render: function(){
        var template = this.template();
        $(this.el).html(template);
        // validate
        var form = $('form', this.el); 
        $(form).validate({
            rules: this.model.rules,
            debug: true,
            submitHandler: this.submitHandler, 
        });
        return this; 
    },

    submitHandler: function(){
      var params = $('form', this.el).serializeObject();
      this.model.save(params, {success: this.xhr})
    },

    xhr: function(model, res, xhr){
      if (res === true)
        this.options.app_router.navigate('/', true)
      if (res === false){
        this.alert.render('error', 'Please check your email or password')
      }
    },

  });
  
  return LoginView 

});
