
/**
 * Module dependencies.
 */

var express = require('express')
  , mongo = require('mongoskin')
  , RedisStore = require('connect-redis')(express)
  , schemas = require('./schemas')
  , form = require("express-form")
  , filter = form.filter
  , validate = form.validate
  , tame = require('tamejs').register() // register the *.tjs suffix
  , site = require('./site')
  , user = require('./user.tjs')
//  , Backbone = require('backbone')
  , bcrypt = require('bcrypt')
  , requirejs = require('requirejs')
//  ,  _ = require('underscore')

db = mongo.db('localhost/rubyrate?auto_reconnect');

requirejs.config({
    baseUrl: __dirname + '/public/js/',
//    nodeRequire: require
});

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "batman", store: new RedisStore }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

app.all('*',function(req,res,next){
  console.log(req.url);
  next();
});

function isXhr(req, res, next) {
  if (!(req.xhr)) {
    if (req.session.user)
      res.render('layout', { username: req.session.user.username});
    else 
      res.render('layout');
  }
  else
    next()
}

/*res_xhr = function(success, msg, errors) {
  return {
    success: success,
    message: msg || '',
    error: errors || {} 
  }
}
*/
function isValid(req, res, next) {
  if (!req.form.isValid)
    res.send({success: false, message: 'invalid data'});
  else
    next();
}

function isValidSimple(req, res, next) {
  if (!req.form.isValid)
    res.send(false);
  else
    next();
}

templates = __dirname + '/public/templates';

app.get('/', isXhr, function(req, res) {
  //TODO whats going on here?
  if (req.session.user) {

  }
  res.partial('index', function(err, html){
    res.send({title: 'Ruby Rate', body: html});
  });

});


app.get('/signup', isXhr, function(req, res) {
  res.partial(templates + '/users/signup.jade', function(err, html){
    res.send({title: 'Sign Up', body: html});
  });
});

app.post('/signup', 
    form(
      validate("username").required().isAlphanumeric().minLength(2).maxLength(60)
    , validate("password").required().minLength(6)
    , validate("email").required().isEmail()
    )
  , isValid
  , user.signup
);



app.get("/is-username-valid", 
    form(validate("username").required().isAlphanumeric().minLength(2).maxLength(60))
  , isValidSimple 
  , user.is_username_valid
);


app.get("/check-email", 
    form(validate("email").required().isEmail())
  , isValid 
  , user.check_email
);

app.get("/user", function(req, res) {
  return req.session.user 
    ? res.send({success: true, msg: 'user is logged in', data: {username: req.session.user.username}}) 
    : res.send({success: false, msg: 'users is not logged in' })
});


app.get('/login', isXhr, function(req, res) {
  res.partial(templates + '/users/login.jade', function(err, html){
    res.send({title: 'Login', body: html});
  });
});


app.post('/login_test', function(req, res) {
  requirejs(['libs/underscore/underscore', 'libs/backbone/backbone', 'models/wish', 'libs/backbone.validation'],
    function (a, b , Wish) {

      var Model = Backbone.Model.extend({
        validation: {
          email: { required: true },
          password: { required: true },
        }
      })
      _.extend(Backbone.Validation.callbacks, {
        valid: function(view, attr, selector) { },
        invalid: function(view, attr, error, selector) {  }
      });

      var model = new Model(req.body)
      var view = new Backbone.View.extend()
      view.model = model
      Backbone.Validation.bind(view);

      if (model.isValid(true)) {   
        console.log('cool all thru') 
      }
      else {
        console.log('bad stuff') 
      }
  });

})

app.post('/login', function(req, res) {
  var fail_res = {success: false, message: 'user login unsuccessful'};
  db.collection('users').findOne({email: req.body.email}, function(err, user){
    if (!user) {  
      return res.send(fail_res);
    }
    bcrypt.compare(req.body.password, user.password, function(err, match) {
      if (!match) {
        return res.send(fail_res)
      }
      req.session.user = user;
      res.send({success: true, 
                message: 'user successfully logged in',
                data: {username: user.username}
      })
    })
  })
})

app.get('/logout', function(req, res) {
  req.session.destroy(function(){
    res.redirect('home');
  });
});

app.post('/sessions', function(req, res) {
  User.find({ email: req.body.user.email }).first(function(user) {
    if (user && user.authenticate(req.body.user.password)) {
      req.session.user_id = user.id;
      res.redirect('/');
    } else {
      // TODO: Show error
      res.redirect('/sessions/new');
    }
  }); 
});

app.post('/wishes', restrict, function(req, res) {
   requirejs(['libs/underscore/underscore', 'libs/backbone/backbone', 'models/wish', 'libs/backbone.validation'],
    function (a, b , Wish) {
      _.extend(Backbone.Validation.callbacks, {
        valid: function(view, attr, selector) {},
        invalid: function(view, attr, error, selector) {}
      });
      var wish = new Wish(req.body)
      var view = new Backbone.View.extend()
      view.model = wish
      Backbone.Validation.bind(view);

      if (wish.isValid(true)) {   
        req.body['username'] = req.session.user.username 
        req.body['user_id'] = req.session.user._id 
        db.collection('wishes').insert(wish.toJSON(), function(err, id){
          res.send({success: true, message: 'wish inserted'})
        })
      }
      else {
        console.log('bad stuff') 
      }
  });
});


app.get('/wishes', restrict, function(req, res) {
  var username = req.session.user.username
  db.collection('wishes').find({username: username }).toArray(function(err, result) {
      if (err) throw err;
      res.send(result)
  })
})

app.get('/fulfill-wishes', isXhr, function(req, res) {
  db.collection('wishes').find().toArray(function(err, result) {
      if (err) throw err;
      res.send(result)
  })
})

app.get('/wishes/:id', function(req, res) {
  db.collection('wishes').findById(req.params.id, function(err, result) {
      if (err) throw err;
      res.send(result)
  })
})



app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
