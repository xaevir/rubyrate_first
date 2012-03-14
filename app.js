
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
  , bcrypt = require('bcrypt')
  , requirejs = require('requirejs')

//  ,  _ = require('underscore')
//  , Backbone = require('backbone')

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
      res.render('layout', { user: {username: req.session.user.username, _id:  req.session.user._id}});
    else 
      res.render('layout', {user: {}});
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

app.post('/signup', function(req, res){ 
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(req.body.password, salt, function(err, hash){
      req.body.password = hash;
      db.collection('users').insert(req.body, function(err, result){
        var user = result[0]
        req.session.user = user;
        user.password = '';
        res.send(user);
      })
    })
  }) 
})

app.get("/is-username-valid", function(req, res) {
  db.collection('users').findOne({username: req.body.username}, function(err, user){
    return user 
      ? res.send(false) 
      : res.send(true);
  })
})

app.get("/check-email", function(req, res){
  db.collection('users').findOne({email: req.body.email}, function(err, user){
    return user
      ? res.send(false)
      : res.send(true);
  })
})

app.get('/login', isXhr, function(req, res) { });

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

app.post('/session', function(req, res) {
  db.collection('users').findOne({email: req.body.email}, function(err, user){
    if (!user)   
      return res.send({});
    bcrypt.compare(req.body.password, user.password, function(err, match) {
      if (!match) 
        return res.send({})
      req.session.user = user;
      user.password = '';
      res.send(user)
    })
  })
})


app.del('/session', function(req, res) {
  req.session.destroy(function(){
      res.send({success: true, 
                message: 'user logged out'
      })
  });
});
/*
app.post('/session', function(req, res) {
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
*/
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
        db.collection('messages').insert(wish.toJSON(), function(err, id){
          res.send({success: true, message: 'wish inserted'})
        })
      }
      else {
        console.log('bad stuff')
      }
  });
});

app.get('/conversations', restrict, function(req, res) {
  var username = req.session.user.username
  db.collection('messages').find({'author.username': username, ancestors: {$exists: false} }).toArray(function(err, result) {
      if (err) throw err;
      res.send(result)
  })
})

app.get('/be-genie', isXhr, function(req, res) {
  db.collection('messages').find({recipient: {$exists: false}}).toArray(function(err, result) {
      if (err) throw err;
      res.send(result)
  })
})

app.get('/conversations/:id', function(req, res) {
  db.collection('messages').find({ancestors: req.params.id}, function(err, result) {
      if (err) throw err;
      res.send(result)
  })
})

app.post('/messages', restrict, function(req, res) {
  db.collection('messages').insert(req.body, function(err, id){
    res.send({success: true, message: 'message inserted'})
  })
})


app.listen(8002);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
