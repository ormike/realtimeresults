'use strict';

const express = require('express');
const ejs = require('ejs');
const path = require('path');
//const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler');
//const session = require('express-session');
//const passport = require('passport');
//const routes = require('./routes');
const partials = require('express-partials');
const multer = require('multer');
const upload = multer({ dest: '.' });

// Express configuration
const app = express();
app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(partials());
//app.use(cookieParser());
// app.use(express.json({ extended: false }));        // parse JSON bodies
app.use(express.json()); //Used to parse JSON bodies
// app.use(express.urlencoded({ extended: false }));  // parse URL-encoded bodies
app.use(express.urlencoded());  // parse URL-encoded bodies
app.use(errorHandler());
//app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
//app.use(passport.initialize());
//app.use(passport.session());

// Passport configuration
//require('./auth');

//app.use('/assets', express.static(__dirname + '/src/assets'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

app.post('/upload', upload.none(), function(req, res) {
    console.log(req.files);
    console.log(req.body);
    console.log(req.headers);
    res.json({status: "ok"});
});

app.listen(process.env.PORT || 3000, function() {
    console.log("server listening on port " + (process.env.PORT || 3000));
});

// Required for @now/node, optional for @now/node-server.
//module.exports = app;

/*
app.use('/assets', express.static('assets'))
app.get('/', routes.site.index);
app.get('/home', routes.site.home);
app.get('/login', routes.site.loginForm);
app.post('/login', routes.site.login);
app.get('/logout', routes.site.logout);
app.get('/account', routes.site.accountForm);
app.post('/account', routes.site.account);

app.get('/signup', routes.site.signupForm);
app.post('/signup', routes.site.signup);

app.get('/resetpassword', routes.site.resetPasswordForm);
app.post('/resetpassword', routes.site.resetPassword);

app.get('/changeemail', routes.site.changeEmailForm);
app.post('/changeemail', routes.site.changeEmail);

app.get('/changepassword', routes.site.changePassword);

app.get('/register', routes.site.registerForm);
app.post('/register', routes.site.register);

app.get('/auth/google',
  passport.authenticate('google', { scope: ["openid", "profile", "email"] }));
  //passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
  //passport.authenticate('google', { scope: [ 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email' ] }));
app.get('/auth/google/callback', routes.site.google);

// may return an authorization grant or a token, sends it to client through user agent as a redirect
// note: the redirect_uri points to the resource server, not this auth server
app.get('/dialog/authorize', routes.oauth2.authorization);
app.post('/dialog/authorize/decision', routes.oauth2.decision);

// get a token from authorization grant, sends it as a response to the POST
// the response goes to the same redirect_uri as was used to get the grant
app.post('/oauth/token', routes.oauth2.token);

// todo: add a token introspection endpoint similar to the following two
// put it on a route similar to these with session: false
// then the resource server can easily verify the user and scope (authorization)
app.get('/api/userinfo', routes.user.info);
app.get('/api/clientinfo', routes.client.info);

// Might have to comment out the line of code below for some serverless environments.
// For example, it will work as is with @now/node-server, but not with @now/node.

// https://zeit.co/docs/v2/deployments/official-builders/node-js-server-now-node-server/
// vs.
// https://zeit.co/docs/v2/deployments/official-builders/node-js-now-node/
*/