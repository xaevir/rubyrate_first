define([
  'text!templates/users/signup.jade',
  'views/site/alert',
  'libs/jade/jade',
  'libs/jquery-validation/jquery.validate',
], function(tpl, AlertView){


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
  }, "Please try another username. This one is taken.");


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
        remote: 'is-username-valid',
      },
      email: {
        required: true,
        email: true,
        uniqueEmail: true,
      },
      password: {
        required: true,
        minlength: 6 
      },
    },
    messages: {
      username: {
        required: 'Please enter a username',
        minlength: $.format("Enter at least {0} characters"),
        maxlength: $.format("Please enter no more than {0} characters."),
        alphanumeric: 'A username must contain only letters, numbers, or dashes.',
        //remote: $.validator.format("{0} is taken. Please try another."),
      },
      email: {
        required: 'Please enter an email',
        email: "Please enter a valid email address.",
        uniqueEmail: 'That email is already taken',
      },
      password: {
        required: 'Please enter a password',
        minlength: $.format("Enter at least {0} characters")
      }
    }
  });

  var SignupView = Backbone.View.extend({

    template: jade.compile(tpl),

    events: {
      //'submit form' : 'submit'
    },

    initialize: function(options){
        _.bindAll(this, 'render', 'submitHandler', 'xhr'); 
        this.user = options.user;
        this.model = new Model;
        this.context = options.context
        if (this.context == 'main')
          this.el = $('<div class="span3 offset4 body-content-small">');
    },

    render: function(){
      var template = this.template();
      $(this.el).html(template);
      // validate
      var form = $('form', this.el); 
      $(form).validate({
          rules: this.model.rules,
          messages: this.model.messages,
          submitHandler: this.submitHandler, 
      });
      return this; 
    },

    submitHandler: function(){
      var params = $('form', this.el).serializeObject();
      this.model.save(params, {success: this.xhr})
    },

    xhr: function(model, res, xhr){
      if (res.success === true) {
        this.user.set({username: model.get('username')})
        router = new Backbone.Router();
        router.navigate('/', true)
        new AlertView({
            message: '<strong>Thank you for signing up!</strong>'
          , type: 'success'
          , timer: true
        });
      }
      if (res.success === false){
        this.alert.render('error', 'Please check your email or password')
      }
    },
  });
  
  return SignupView

});
