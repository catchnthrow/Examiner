// // Get dependencies
// var _ = require("lodash");
// var bodyParser = require("body-parser");
// var jwt = require('jsonwebtoken');
// var passport = require("passport");
// var passportJWT = require("passport-jwt");

// var ExtractJwt = passportJWT.ExtractJwt;
// var JwtStrategy = passportJWT.Strategy;

// var jwtOptions = {}
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
// jwtOptions.secretOrKey = 'QsrW32@###sAarpin#@2dronhezzfvm-7';

// var user = require('../../data_access_layer/user');
// var async = require('async');



// var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
//     console.log('payload received-----------------', jwt_payload);
//     // usually this would be a database call:
//     var userDetails;
//     async.parallel({
//         usr : user.fnIsValidUser.bind(null, jwt_payload)
//     }, function(err, data){
//         userDetails = data.usr;
//         if (userDetails) {
//             next(null, userDetails);
//           } else {
//             next(null, false);
//           }
//     });
// });

//  passport.use(strategy);