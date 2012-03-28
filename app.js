var express = require('express')
  , mongo = require('mongoskin')
  , RedisStore = require('connect-redis')(express)
  , bcrypt = require('bcrypt')
  , form = require("express-form")
  , fs = require('fs')
  , nodemailer = require("nodemailer")
  , Hogan = require('hogan.js')
  , requirejs = require('requirejs')
  ,  _ = require('underscore')
  , Backbone = require('backbone')


//  , schemas = require('./schemas')
//  , form = require("express-form")
//  , filter = form.filter
//  , validate = form.validate



Backbone = require('backbone')
_ = require('underscore')
var  Validation = require('./public/js/libs/backbone.validation/backbone.validation.js')

var smtpTransport = nodemailer.createTransport("SMTP", {host: "localhost"})

db = mongo.db('localhost/rubyrate?auto_reconnect')
var staticServer = express.static(__dirname + '/public')
var app = module.exports = express.createServer()

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "batman", store: new RedisStore }));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
})

app.configure('production', function(){
  app.use(express.errorHandler()); 
})

app.get('/*', function(req, res, next) {
  if (req.headers.host.match(/^www/) !== null ) res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url, 301);
  else next();
});

app.get('/css/*', function(req, res, next) {
  staticServer(req, res, next)  
})

app.get('/js/*', function(req, res, next) {
  staticServer(req, res, next)  
})

app.get('/img/*', function(req, res, next) {
  staticServer(req, res, next)  
})

app.get('/fonts/*', function(req, res, next) {
  staticServer(req, res, next)  
})

function userData(session){
  var data = {user: {}}
  if (session.user) {
    data.user = {
      username: session.user.username, 
      _id:  session.user._id
    }
  }
  return data
}

app.get('/*', function(req, res, next) { /* force xhr */
  if (!(req.xhr)) 
    res.render('layout', userData(req.session))
  else 
    next()
})

app.get('/*', function(req, res, next) {
  if (req.headers.host.match(/^www/) !== null ) {
    res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
  } else {
    next();     
  }
})

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

<<<<<<< HEAD
app.get('/', function(req, res) {
  res.render('index', function(err, html){
    res.send({title: 'Ruby Rate', body: html});
  });
})
=======

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
>>>>>>> 00ace41f8a935e1f127dc3b9141b268b91f149b9

app.get('/login', function(req, res) {});

app.get('/contact', function(req, res) {});

app.post('/contact', function(req, res) {
  var message = {
    // sender info
    from: 'Ruby Rate Contact Page <contact@rubyrate.com>',
    // Comma separated list of recipients
    to: 'bobby.chambers33@gmail.com',
    // Subject of the message
    subject: 'Feedback from contact page', 
  }

  // TODO add cache from mailer code
  fs.readFile(__dirname + '/views/email.mustache', function(err, result){
    var template = result.toString()
    template = Hogan.compile(result.toString())
    message.html = template.render(req.body)
    // send mail with defined transport object
    smtpTransport.sendMail(message, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
        smtpTransport.close(); // shut down the connection pool, no more messages
        res.send({
          success: true, 
          message: 'email sent'
        })
    })
  })
})

// TODO use email check form backbone.validator 
app.post('/session', function(req, res) {
  var key
  var spec = {}
  try {
    check(req.body.login).isEmail()
    key = 'email'
  } catch(e) {
    key = 'username'
  }
  spec[key] = req.body.login  

  db.collection('users').findOne(spec, function(err, user){
    if (!user)
      return res.send({message: 'user not found'});
    bcrypt.compare(req.body.password, user.password, function(err, match) {
      if (!match) 
        return res.send({message: 'user not found'});
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

app.get('/signup', restrict, function(req, res) { });

app.post('/signup', restrict, function(req, res){ 
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

app.get('/be-genie', function(req, res) {
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
