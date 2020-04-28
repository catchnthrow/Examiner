// Get dependencies
var _ = require("lodash");
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var cookieExtractor = function(req, res) {
  console.log("res :", res);
  if(req.cookies != undefined )
  {
  console.log('cookies count',  req.cookies.length);
  console.log('cookies : ',  req.cookies);
  }
  else {
    console.log('no cookies found');
  }
  var token = null;
  if (req && req.cookies)
  {
      console.log("inside cookieExtractor()");
      token = req.cookies['jwt'];
  }
  console.log("token : ", token);
  return token;
};


var jwtOptions = {};
jwtOptions.jwtFromRequest = cookieExtractor;
jwtOptions.secretOrKey = 'QsrW32@###sAarpin#@2dronhezzfvm-7';

const express = require('express');
const path = require('path');
const http = require('http');
var async = require('async');
var cookieParser = require('cookie-parser')
//const bodyParser = require('body-parser');

// Get our API routes
const api = require('./server/routes/api');
const adminApi = require('./server/routes/admin');
const user = require('./data_access_layer/user');
const loginHistory = require('./data_access_layer/login_history');
const app = express();
app.use(passport.initialize());
// Parsers for POST data

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cookieParser());

// Set our api routes
app.use('/api', api);
app.use('/admin', adminApi);

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  if(jwt_payload != undefined && jwt_payload.id != undefined && jwt_payload.id > 0){
    next(null, jwt_payload);
  } else {    
      next(null, false);
  }
});

passport.use(strategy);

app.post("/login", function(req, res){
  if(req.body.u == undefined || req.body.p == undefined){
    res.json({message: "Failure"});
    return;
  }  
  var userInput = {
    username : req.body.u,
    password : req.body.p
  }
  //console.log('userInput : ', userInput);
  async.waterfall([
    async.apply(user.fnIsValidUser, userInput)
  ], function(err, data){
    if(err != null){
      console.log(err);
      res.status(401).json({message: "Failure"});
      loginHistory.saveLoginActivity(userInput, false);
    } else {
      if(req.body.u == 'prashant19sep@gmail.com'){
        console.log(data);
        data.isAdmin = true;
      }
      //console.log(data);
      if(null != data && data != undefined && data.id != undefined){
        var payload = {id: data.id, email: data.email};
        var token = jwt.sign(payload, jwtOptions.secretOrKey,{
          expiresIn: "2 days" //30*60 // in seconds
      });
        //console.log(token);
        res.cookie('jwt',  token, { maxAge: 900000, httpOnly: true });
        res.status(200).json({message: "Success", token: token, user : data});
        loginHistory.saveLoginActivity(data, true);
      } else {
        res.status(401).json({message: "Failure"});
        loginHistory.saveLoginActivity(userInput, false);
      }
    }
  });  
});

// app.post('/check', passport.authenticate('jwt', {session: false}), function(req, res){
//   console.log("Asdfasdfasdfsdfasdfd");
//   res.json("jwt works");
// });
























// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});



/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '4200';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));