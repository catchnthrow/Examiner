const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var connection_config = require('../config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);
var passport = require("passport");
var async = require('async');
const user = require('../../data_access_layer/user');
var student = require('../../data_access_layer/student');
var questionPaperManager = require('../../managers/question_paper_manager');
var examManager = require('../../managers/exam_manager');
var scoreManager = require('../../managers/score_manager');
/* GET api listing. */
router.get('/', (req, res) => {
    console.log(req.body);
  res.send('api works');
});

router.get('/getUserFromCookie', passport.authenticate('jwt', { session:false}), function(req, res){
    console.log("getUserFromCookie API called.");
    console.log("user info :", req.user);
    async.waterfall([
        async.apply(user.getUserById, req.user.id)
      ], function(err, data){
        if(err != null){
           res.status(401).json({message: "Failure"});
        } else {
          console.log(data);
          if(null != data && data != undefined && data.id != undefined){
            res.status(200).json({user : data});
          } else {
            res.status(401).json({message: "Failure"});
          }
        }
      });
    //res.json(req.user);
});

router.get('/availableExams', passport.authenticate('jwt', { session:false}), (req, res) => {
  console.log('availableExams called');
  console.log("req.user: ", req.user);
  async.waterfall([
    async.apply(questionPaperManager.getAvailableExamsList, req)
  ], function(err, data){
    if(err != null){
       res.status(200).json({message: err});
    } else {
      console.log(data);
      if(null != data && data != undefined && data.length > 0){
        res.status(200).json({examsList : data});
      } else {
        res.status(200).json({message: "No exams available at this time for you."});
      }
    }
  });
});

router.post('/saveAnswer', passport.authenticate('jwt', { session:false}),
(req, res) => {
  async.waterfall([
    async.apply(examManager.saveAnswer, req)
  ], function(err, data){
    if(err != null){
      res.status(200).json({message: err});
    } else {
      if(null != data && data != undefined){
        res.status(200).json(data);
      } else {
        res.status(200).json({message: "Error"});
      }
    }
  });
});

router.post('/updateAnswer', passport.authenticate('jwt', { session:false}),
(req, res) => {
  async.waterfall([
    async.apply(examManager.updateAnswer, req)
  ], function(err, data){
    if(err != null){
      res.status(200).json({message: err});
    } else {
      if(null != data && data != undefined){
        res.status(200).json(data);
      } else {
        res.status(200).json({message: "Error"});
      }
    }
  });
});

router.get('/deleteAnswer?:questionId', passport.authenticate('jwt', { session:false}),
(req, res) => {
  async.waterfall([
    async.apply(examManager.deleteAnswer, req)
  ], function(err, data){
    if(err != null){
      res.status(200).json(err);
    } else {
      if(null != data && data != undefined){
        res.status(200).json(data);
      } else {
        res.status(200).json(err);
      }
    }
  });
});

router.post('/updateTimer', passport.authenticate('jwt', { session:false})
      , (req, res) => {
  console.log("updateTimer api hit!!!");
  async.waterfall([
    async.apply(examManager.updateTimer, req)
  ], function(err, data){
    if(err != null){
      res.status(200).json({message: err});
    } else {
      console.log(data);
      if(null != data && data != undefined){
        res.status(200).json({status : data});
      } else {
        res.status(200).json({message: "Error updating timer!!!"});
      }
    }
  });
});

router.get('/startExam?:id', passport.authenticate('jwt', { session:false})
      , (req, res) => {
  console.log("startExam api hit!!!");
  async.waterfall([
    async.apply(examManager.startExam, req)
  ], function(err, data){
    if(err != null){
      res.status(200).json({message: err});
    } else {
      console.log(data);
      if(null != data && data != undefined){
        res.status(200).json({questionPaper : data});
      } else {
        res.status(200).json({message: "Error fetching Question Paper!!!"});
      }
    }
  });
});

router.post('/endExam', passport.authenticate('jwt', {session:false})
  , (req, res) => {
    console.log("endExam api hit!!!");
    async.waterfall([
      async.apply(examManager.endExam, req)
    ], function(err, data){
      if(err != null){
        res.status(200).json(err);
      } else {
        console.log(data);
        if(null != data && data != undefined){
          res.status(200).json(data);
        } else {
          res.status(200).json({message: "Error ending Exam!!!"});
        }
      }
    });
  });


  router.post('/register', (req, res) => {
  console.log("register called");
  console.log("registerInfo", req.body.userInfo);

  var registerInfo = req.body.userInfo;
  //ToDo : This should be in a manager. Eg. RegistrationManager.
  async.waterfall([
    async.apply(user.getUserByEmailId, registerInfo),
    function(params, callback){
      if(params.isUserExists){
        callback("Email Exists ", null); 
      } else {
        callback(null, params);
      }
    },
    user.addNewUser,
    student.addNewStudent
  ],function(err, data){
      if(err != null){
        console.log(err);
        res.status(200).json({message: err});
      } else {
        if(data.isStudentCreated == true){
          res.status(200).json({message: 'Registration Successful'});
        } else {
          res.status(200).json({message: 'Registration Failed'});
          console.log(data);
        }
      }
    });
});

router.post('/login', (req, res) => {
    console.log('Login Called');
    console.log(req.body);
    
    var uid = req.body.u;
    var pwd = req.body.p;

    console.log("uid", uid);

    console.log("pwd", pwd);
    var query = `select * from user where (email='`+uid+`' OR username='`+uid+`') AND password='`+pwd+`'`;
    mysql_pool.getConnection(function(err, connection) {
        if(err != undefined){
            console.log(err);
            res.send('login failed');
        } else {
        connection.query(query, function (error, results, fields) {
            console.log('error :', error);
            console.log('results :', results);
            if (error) throw error;
            connection.release();         
        });
        }
    });
});

router.post('/registerExam', passport.authenticate('jwt', { session:false}), (req, res) => {
  console.log('registerExam called');
  async.waterfall([
    async.apply(examManager.registerForExam, req)
  ], function(err, data){
    if(err != null){
       res.status(200).json({message: err});
    } else {
      console.log(data);
      if(null != data && data != undefined){
        res.status(200).json({message : "Success"});
      } else {
        res.status(200).json({message: "Error!!! Registration failed"});
      }
    }
  });
});

router.get('/getExamScore?:id', passport.authenticate('jwt', { session:false}), (req, res) => {
  console.log("getExamScore api hit!!!");
  async.waterfall([
    async.apply(scoreManager.getScore, req)
  ], function(err, data){
    if(err != null){
      res.status(200).json({message: err});
    } else {
      //console.log(data);
      if(null != data && data != undefined){
        res.status(200).json({score : data});
      } else {
        res.status(200).json({message: "Error fetching Score Details!!!"});
      }
    }
  });
});

router.get('/getExamAnalysis?:id', passport.authenticate('jwt', { session:false})
      , (req, res) => {
  console.log("getExamAnalysis api hit!!!");
  async.waterfall([
    async.apply(examManager.getExamAnalysis, req)
  ], function(err, data){
    if(err != null){
      res.status(200).json({message: err});
    } else {
      //console.log(data);
      if(null != data && data != undefined){
        res.status(200).json({questionPaper : data});
      } else {
        res.status(200).json({message: "Error fetching Question Paper!!!"});
      }
    }
  });
});
module.exports = router;