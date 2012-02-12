define([
  'libs/hogan.js/web/builds/1.0.5/hogan-1.0.5.min.amd',
  'text!templates/users/userNav.mustache',
  'views/wishes/create_wish',
  'views/users/signup',
], function(hogan, userNavTpl, CreateWishView, SignUpView){

  var NavBar = Backbone.View.extend({

    initialize: function(){
      this.model.on('change', this.render_usernav, this); 
      this.model.on('change', this.render_context_menu, this); 
    },

    el: '.navbar',

    events: {
      'click .create-wish' : 'create_wish'
    },

    template: hogan.compile(userNavTpl),

    render_usernav: function(model) {
      var username, template;

      username = model.get('username');
      if (username) {
        template = this.template.render({user: {name: username }});
      } else {
        var signUpView = new SignUpView({context: 'aux', user: this.user})
        signupEl = signUpView.render().el
        template = this.template.render({signup: signupEl.innerHTML});
      }
      $('.nav-user').html(template);
      $('.dropdown-toggle').dropdown()
      return this;
    },

    render_context_menu: function(){
      if (this.model.get('username')) 
        $('.nav-base').append('<li><a href="#" class="create-wish">Create Wish</a></li>')  
    },
   
    create_wish: function(e) {
      e.preventDefault(); 
      var createWishView = new CreateWishView(); 
      createWishView.render();
    }


  });

  var initialize = function(user){
    var navBar = new NavBar({model: user});
  };    

  return {
    initialize: initialize
  };


});  
