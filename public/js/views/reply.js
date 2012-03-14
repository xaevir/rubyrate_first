define(function(require) {

var tpl = require('text!templates/reply.jade')
  , Message = require('models/message') 
  , AlertView = require('views/site/alert')

var ReplyView = Backbone.View.extend({

  className: 'reply-unit',

  template: jade.compile(tpl),

  events: {
    'keyup :input': 'setAttr',
    'paste :input':  'onPaste',
    'submit form' : 'submit'
  },

  onPaste: function(el){
    var setAttr = this.setAttr
    setTimeout(function(){setAttr(el)}, 100)
  },

  button: '',

  modelDefaults: function(){
    return {
      author: {
        _id      : window.user.id,
        username : window.user.get('username')
      },
      kickoff_id: this.kickoff.get('_id'),
    } 
  },

  initialize: function(options) {
    _.bindAll(this, 'render', 'submit', 'setAttr', 'reset')
    this.kickoff = options.kickoff
    Message.prototype.defaults = this.modelDefaults()
    this.model = new Message()
    Backbone.Validation.bind(this);
    this.model.on("validated:valid", this.valid, this)
    this.model.on("validated:invalid", this.invalid, this);
  },

  reset: function() {
    // need this off event bc the model gets validated on set and save. 
    // the save fucntion tied to the valid event is being called after everything
    // is rerendered and ready to go. The effect is that it is removing the 
    // disabled attribute from the button even though there is nothing in the textarea
    // It is a leftover over event. 
    this.model.off()
    this.model = new Message()
    this.render()
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
    var reset = this.reset
    this.collection.create(this.model, {success: function(model, res){
      reset()   
    }})
    var alertView = new AlertView({
      message: 'Message sent',
      type: 'success'     
    })
    alertView.fadeOut()
  }
})

return ReplyView

})
