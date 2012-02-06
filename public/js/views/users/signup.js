define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/users/signup.jade',
  'libs/jade/jade',
  'libs/jquery-validation/jquery.validate',
], function($, _, Backbone, tpl){


  $.validator.addMethod("alphanumeric", function(value, element) {
      return this.optional(element) || /^[a-z0-9\-]+$/i.test(value);
  }, "Username must contain only letters, numbers, or dashes.");


  $.validator.addMethod("uniqueUsername", function(value, element) {
     var isSuccess = false;

     $.ajax({ url: "/check-username", 
              data: {username: value}, 
              async: false, 
              success: 
                  function(res) { isSuccess = res === true ? true : false }
            });
      return isSuccess;
  }, "This username is already taken. Please try another.");


  $.validator.addMethod("uniqueEmail", function(value, element) {
     var isSuccess = false;

     $.ajax({ url: "/check-email", 
              data: {email: value}, 
              async: false, 
              success: 
                  function(res) { isSuccess = res === true ? true : false }
            });
      return isSuccess;
  }, "This email is already taken. Please try another.");



  var Model = Backbone.Model.extend({ 
    url: '/signup',
    
    rules: {
      username: {
        required: true,
        minlength: 2,
        maxlength: 60,
        alphanumeric: true,
        uniqueUsername: true 
      },
      email: {
        required: true,
        minlength: 6,
        email: true,
        uniqueEmail: true,
      },
      password: {
        required: true,
        minlength: 6 
      },
    }
  });

  var SignupView = Backbone.View.extend({

    template: jade.compile(tpl),

    events: {
      //'submit form' : 'submit'
    },

    initialize: function(){
        _.bindAll(this, 'render', 'submitHandler', 'xhr'); 
        this.model = new Model;
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
      if (res.success === true)
        this.options.app_router.navigate('/', true)
      if (res.success === false){
        this.alert.render('error', 'Please check your email or password')
      }
    },
  });
  
  return SignupView

});
