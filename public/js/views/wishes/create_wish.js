define(['views/site/alert', 
        'text!templates/wishes/create_wish.jade', 
        'models/wish',
        'order!/bootstrap/js/bootstrap-modal.js', 
        'order!libs/backbone.validation'
        ], 
function (AlertView, tpl, Wish) {

  var CreateView = Backbone.View.extend({

    template: jade.compile(tpl),
   
    className: 'modal',

    events: {
      'keyup :input': 'setAttr',
      'change select': 'setAttr',
      'submit form' : 'submit'
    },

    submit_btn: '',

    initialize: function() {
      _.bindAll(this, 'render', 'submit');
      this.model = new Wish();
      Backbone.Validation.bind(this);
      this.model.bind("validated:valid", this.valid, this);
      this.model.bind("validated:invalid", this.invalid, this);
      this.submit_btn = $('.btn', this.el);
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
        this.submit_btn.removeAttr('disabled');
    },

    invalid: function(model) {
        if (this.submit_btn.attr('disabled')) return
        this.submit_btn.attr('disabled', 'true')
    },
  
    render: function () {
      var template = this.template();
      $(this.el).html(template);
      $(this.el).modal('show');
    },

    submit: function (form) {
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
