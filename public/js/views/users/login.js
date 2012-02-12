define([
  'text!templates/users/login.jade',
  'views/site/alert',
  'libs/jade/jade',
  'libs/jquery-validation/jquery.validate',
], function(tpl, AlertView){

  var Model = Backbone.Model.extend({ 
    url: '/login',
    
    rules: {
      email: {
        required: true
      },
      password: {
        required: true
      }
    }
  });

  var LoginView = Backbone.View.extend({

    template: jade.compile(tpl),

    events: {
      //'submit form' : 'submit'
    },

    alreadyAlerted: false,

    initialize: function(options){
        _.bindAll(this, 'render', 'submitHandler', 'ajax_success'); 
        this.model = new Model;
        this.user = options.user;
    },

    render: function(){
        var template = this.template();
        $(this.el).html(template);
        // validate
        var form = $('form', this.el); 
        $(form).validate({
            rules: this.model.rules,
            submitHandler: this.submitHandler, 
        });
        return this; 
    },

    submitHandler: function() {
      var params = $('form', this.el).serializeObject();
      $.post('/login', params,  this.ajax_success) 
    },

    ajax_success: function(res){
      if (res.success === true) {
        this.user.set({username: res.data.username});
        var router = new Backbone.Router();
        router.navigate('/', true);
        return
      } 
      if (this.alreadyAlerted) return; 
      var alert_view = new AlertView();
      alert_view.message = '<strong>Heads Up!</strong> Please check your email or password';
      alert_view.type = 'error';
      alert_view.render();
      this.alreadyAlerted = true; 
    }
  });
  
  return LoginView;

});
