var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var passwordHash = require('password-hash');


// PASSPORT
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    key: 'cookieUser',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// SCHEMA
var userSchema = new Schema({
    login: { type: String, required: true },
    pass: { type: String, required: true }
});

var UserDb = mongoose.model('user', userSchema);

// PASSPORT LOCAL STRATEGY
passport.use(new LocalStrategy({
        usernameField: 'login',
        passwordField: 'pass'
    }, function(username, password, done) {
        UserDb.findOne({ login: username }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                var error = 'user unknown';
                return done(error);
            }
            if (!passwordHash.verify(password, user.pass)) {
                return done(null, false);
            } else {
                return done(null, user);
            }
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    UserDb.findOne({_id: id}, done);
});

// BDD CONNECTION AND CREATION
mongoose.connect('mongodb://localhost/bdd_api', function(err) {
  if (err) console.log(err);
});

app.use('/myApp', express.static(path.join(__dirname, 'myApp')));

// Redirection vers index.html d'angular
app.set('views', __dirname + '/views');
app.set("view options", {layout: false});
app.engine('html', require('ejs').renderFile);

// LOAD "index.html" of ANGULAR JS

// METHOD /LOGIN
app.post('/login', passport.authenticate('local'), function (req, res) {
    if(!req.user) return res.status(403).end();
    io.emit('socketConnection', req.user);
    res.status(200).send(req.user);
});

// POST NEW USER IN DB
app.post('/users', function (req, res){
    var username = req.body.login;

    UserDb.findOne({ login: username }, function (err, user) {
        if (user && username === user.login) {
            return res.status(500).send({err: 'user exist'});
        } else {
            var userPass = req.body.pass;
            var passUserHashed = passwordHash.generate(userPass);
            req.body.pass = passUserHashed;

            var registerUser = new UserDb(req.body);
            registerUser.save(function (err, user) {
            	if (err) return res.status(500).send(err);
                res.status(200).send(user);
            });
        }
    });
});

// GET ALL USERS
app.get('/users', function (req, res){
  UserDb.find({}, function(err, users) {
      if (err) return res.status(500).send(err);
      res.status(200).send(users);
  });
});

// GET USER BY ID
app.get('/users/:id', function (req, res){
  UserDb.findById(req.params.id, function(err, user) {
      if (err) return res.status(500).send(err);
  res.status(200).send(user);
  });
});

// FIND AND PUT USER BY ID
app.put('/users/:id', function (req, res) {
  UserDb.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
      if (err) return res.status(500).send(err);
  res.send('Got a PUT request at /user');
  });
});

// FIND AND DELETE USER BY ID
app.delete('/users/:id', function (req, res){
  UserDb.findByIdAndRemove(req.params.id, function(err) {
      if (err) return res.status(500).send(err);
  });
});

app.get('/', function(req, res){
    res.render("index.html");
});

// EN COURS ......
//app.get('/logout', function (req, res){
//    req.session.destroy;
//    res.send('tout ok');
//});


// SI L'USER CE CONNECTE NOUS ENVOYONS LA SOCKET SUIVANTE son nom est 'test et son message -> 'tata'
//io.on('connection', function(socket){
//   socket.emit('test', { userConnected: 'Nouvel User Connecté' });
//});

// PORT LISTEN

app.get('/user', function(req, res){
    if (!req.user) return res.status(403).end();
    res.status(200).send(req.user);
});
http.listen(5780, function(){
   console.log('listening on *:5780');
});