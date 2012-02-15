define(function(require) {

var hogan = require('libs/hogan.js/web/builds/1.0.5/hogan-1.0.5.min.amd')
  , userMenuTpl = require('text!templates/users/userNav.mustache')
  , CreateWishView = require('views/wishes/create_wish')  
  , SignUpView = require('views/users/signup') 

var ContextMenu = Backbone.View.extend({
  
  el: '.nav-base',

  events: {
    'click .create-wish' : 'create_wish',
  },

  initialize: function(){
    this.model.on('change', this.render, this); 
    _.bindAll(this, 'render'); 
  },
  
  render: function() {
    if (this.model.get('username')) 
      $(this.el).append('<li><a href="#" class="create-wish">Create Wish</a></li>')
    return this
  },

  create_wish: function(e) {
    e.preventDefault() 
    var createWishView = new CreateWishView();
    createWishView.render()
  }

})


var UserMenu = Backbone.View.extend({

  el: '.nav-user',

  template: hogan.compile(userMenuTpl),

  initialize: function(){
    _.bindAll(this, 'render'); 
    this.model.on('change', this.render, this); 
  },

  render: function(model) {
    var template;
    var username = this.model.get('username');
    if (username) {
      template = this.template.render({user: {name: username }})
      $(this.el).html(template)
    } else {
      var signUpView = new SignUpView({context: 'aux', user: this.user})
      signupEl = signUpView.render().el
      template = this.template.render({signup: signupEl.innerHTML});
      $(this.el).html(template)
      $('.dropdown-toggle').dropdown()
    }
    return this;
  },
})

var initialize = function(user){
  var userMenu = new UserMenu({model: user});
  userMenu.render()
  var contextMenu = new ContextMenu({model: user});
  contextMenu.render()
};    

return {
  initialize: initialize
};


});  
