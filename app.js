
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

db = mongo.db('localhost/rubyrate?auto_reconnect');

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


function loadUser(req, res, next) {
  if (req.session.user_id) {
    User.findById(req.session.user_id, function(user) {
      if (user) {
        req.currentUser = user;
        next();
      } else {
        res.redirect('/sessions/new');
      }
    });
  } else {
    res.redirect('/sessions/new');
  }
}

app.all('*',function(req,res,next){
  console.log(req.url);
  next();
});

function isXhr(req, res, next) {
  if (!(req.xhr))
    res.render('layout');
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
    res.send(false);
  else
    next();
}

templates = __dirname + '/public/templates';

app.get('/', isXhr, site.index);


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


app.get("/check-username", 
    form(validate("username").required().isAlphanumeric().minLength(2).maxLength(60))
  , isValid 
  , user.check_username
);


app.get("/check-email", 
    form(validate("email").required().isEmail())
  , isValid 
  , user.check_email
);

app.get("/check-loggedin", function(req, res) {
  return req.session.user 
    ? res.send({success: true, msg: 'users is logged in', name: req.session.user.username}) 
    : res.send({success: true, msg: 'users is not logged in'})
});


app.get('/login', isXhr, function(req, res) {
  res.partial(templates + '/users/login.jade', function(err, html){
    res.send({title: 'Login', body: html});
  });
});

app.post('/login', 
    form(
      validate("password").required().minLength(6)
    , validate("email").required().isEmail()
    )
  , isValid
  , user.login
);



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


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);