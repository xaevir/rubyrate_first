define(function(require) {

var tpl = require('text!templates/reply.jade')
  , Reply = require('models/reply') 
  , AlertView = require('views/site/alert')

var ReplyView = Backbone.View.extend({

  className: 'reply-form',

  template: jade.compile(tpl),

  events: {
    'keyup :input': 'setAttr',
    'submit form' : 'submit'
  },

  button: '',

  initialize: function() {
    _.bindAll(this, 'render', 'submit', 'reset');
    this.reply_to = this.options.reply_to
    this.model = new Reply();
    this.model.set({ancestors: this.reply_to.get('_id')})
    this.model.set({recipient: this.reply_to.get('author')})
    Backbone.Validation.bind(this);
    this.model.bind("validated:valid", this.valid, this);
    this.model.bind("validated:invalid", this.invalid, this);
    this.model.on('add', this.reset, this)
  },

  reset: function() {
    this.initialize()  
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
    this.button = $('button[type="submit"]', this.el);
    var textarea = $('textarea', this.el)
    var t = setTimeout(function(){
      textarea.focus()
    }, 500);

    return this
  },

  submit: function (e) {
    e.preventDefault()
    this.model.save();
    this.collection.add(this.model)
    var alert_view = new AlertView();
    alert_view.message = 'Reply sent';
    alert_view.type = 'success';
    alert_view.timer = true;
    alert_view.render();
  }



})

return ReplyView

})
