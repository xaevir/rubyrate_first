define(function(require) {

var AlertView = require('views/site/alert')
  , tpl = require('text!templates/wishes/create_wish.jade') 
  , Wish = require('models/wish')

  var CreateView = Backbone.View.extend({

    template: jade.compile(tpl),
   
    className: 'modal modal-wish fade',

    events: {
      'keyup :input': 'setAttr',
      'change select': 'setAttr',
      'submit form' : 'submit'
    },

    button: '',

    initialize: function() {
      _.bindAll(this, 'render', 'submit');
      this.model = new Wish();
      this.model.set({author: window.user})
      Backbone.Validation.bind(this);
      this.model.bind("validated:valid", this.valid, this);
      this.model.bind("validated:invalid", this.invalid, this);
    },

    setAttr: function(e) {
      var field = $(e.currentTarget);
      var name = field.attr('name');
      var value = field.val();
      var attr = {};
      attr[name] =value
      this.model.set(attr)
    },

    valid: function(model) {
      this.button.removeAttr('disabled');
    },

    invalid: function(model) {
        if (this.button.attr('disabled')) return
        this.button.attr('disabled', 'true')
    },
  
    render: function () {
      var template = this.template();
      $(this.el).html(template);
      $(this.el).modal('show');
      $(this.el).center();
      this.button = $('button[type="submit"]', this.el);
    },

    submit: function (e) {
      e.preventDefault()
      this.model.save();
      $('.modal-backdrop').remove();
      $('.modal').remove();
      var alert_view = new AlertView();
      alert_view.message = 'Wish created';
      alert_view.type = 'success';
      alert_view.timer = true;
      alert_view.render();
    }
  });

  return CreateView

});
