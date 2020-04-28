var mysql = require('mysql');
var connection_config = require('../server/config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);
var async = require('async');
var moment = require('moment');
var student = require('../data_access_layer/student');
var questionPaperManager = require('../managers/question_paper_manager');
var answerSheet = require('../data_access_layer/answer_sheet');
var studentExamHistory = require('../data_access_layer/student_exam_history');
var studentExamMapping = require('../data_access_layer/student_exam_mapping');

var exam_manager = {
    adminExamPreview : function(req, callback){
      async.waterfall([
        async.apply(questionPaperManager.getQuestionPaperByIdForAdminPreview, req.query.id, req.user),
        async.apply(answerSheet.getAnswerSheetForAdminPreview, req.user, req.query.id)
      ], function(err, data){
        if(err != null){
          //res.status(200).json({message: err});
          callback(err, null);
        } else {
          console.log(data);
          if(null != data && data != undefined){
            callback(null, data);
          } else {
              callback({message: "Error fetching Question Paper!!!"}, null);
          }
        }
      });
    },

    updateTimer : function(req, callback) {
      async.waterfall([
        async.apply(student.getStudent, req.user),
        async.apply(studentExamHistory.updateExamTimer, req)
        ], function(err, data){
          if(err != null){
            callback(err, null);
          } else {
            if(null != data && data != undefined){
              callback(null, data);
            } else {
                callback({message: "Error updating exam timer!!!"}, null);
            }
          }
      });
    },

    startExam : function(req, callback){
        async.waterfall([
            async.apply(student.getStudent, req.user),
            //TODO : validate if student exam mapping has entry
            //TODO : save student exam history
            async.apply(questionPaperManager.getQuestionPaperById, req.query.id, false),
            async.apply(answerSheet.getAnswerSheet, req.user, req.query.id),
            async.apply(studentExamHistory.studentStartedExam, req)
          ], function(err, data){
            if(err != null){
              //res.status(200).json({message: err});
              callback(err, null);
            } else {
              console.log(data);
              if(null != data && data != undefined){
                callback(null, data);
              } else {
                  callback({message: "Error fetching Question Paper!!!"}, null);
              }
            }
        });
    },

    endExam : function(req, callback){
      async.waterfall([
          async.apply(student.getStudent, req.user),
          //TODO : validate if student exam mapping has entry
          //TODO : save student exam history          
          async.apply(studentExamHistory.studentCompletedExam, req)
        ], function(err, data){
          if(err != null){
            //res.status(200).json({message: err});
            callback(err, null);
          } else {
            console.log(data);
            if(null != data && data != undefined){
              callback(null, data);
            } else {
                callback({message: "Error Ending Exam!!!"}, null);
            }
          }
      });
    },

    saveAnswer : function(req, callback){
      async.waterfall([
        async.apply(student.getStudent, req.user),
        async.apply(answerSheet.saveAnswer, req.body.userAnswer)
      ], function(err, data){
        if(err != null){
          callback(err, null);
        } else {
          console.log(data);
          if(null != data && data != undefined){
            callback(null, data);
          } else {
              callback({message: "Error"}, null);
          }
        }
      });
    },

    updateAnswer : function(req, callback){
      async.waterfall([
        async.apply(student.getStudent, req.user),
        async.apply(answerSheet.updateAnswer, req.body.userAnswer)
      ], function(err, data){
        if(err != null){
          callback(err, null);
        } else {
          console.log(data);
          if(null != data && data != undefined){
            callback(null, data);
          } else {
              callback({message: "Error"}, null);
          }
        }
      });
    },

    deleteAnswer : function(req, callback){
      async.waterfall([
        async.apply(student.getStudent, req.user),
        async.apply(answerSheet.deleteAnswer, req.query.questionId)
      ], function(err, data){
        if(err != null){
          callback(err, null);
        } else {
          console.log(data);
          if(null != data && data != undefined){
            callback(null, data);
          } else {
              callback({message: "Error"}, null);
          }
        }
      });
    },

    createExamSchedule : function(req, callback){
      console.log("req.body", req.body);
      async.waterfall([
          async.apply(studentExamMapping.createNewMapping, req.body.scheduleData),
        ], function(err, data){
          if(err != null){
            console.log(err);
            callback(err, null);
          } else {
            console.log(data);
            if(null != data && data != undefined){
              callback(null, data);
            } else {
                callback({message: "Error!!!"}, null);
            }
          }
      });
    },

    registerForExam : function(req, callback){
      async.waterfall([
        async.apply(student.getStudent, req.user),
        async.apply(questionPaperManager.getQuestionPaperById, req.body.exam.id, false),
        async.apply(studentExamHistory.registerStudentToExam, req)
        ], function(err, data){
          if(err != null){
            callback(err, null);
          } else {
            if(null != data && data != undefined){
              callback(null, data);
            } else {
                callback({message: "Error registering for exam!!!"}, null);
            }
          }
      });
    },

    getExamAnalysis : function(req, callback){
      async.waterfall([
          async.apply(student.getStudent, req.user),
          //TODO : validate if student exam mapping has entry
          //TODO : save student exam history
          async.apply(questionPaperManager.getQuestionPaperById, req.query.id, true),
          async.apply(answerSheet.getAnswerSheet, req.user, req.query.id)
        ], function(err, data){
          if(err != null){
            //res.status(200).json({message: err});
            callback(err, null);
          } else {
            //console.log(data);
            if(null != data && data != undefined){
              callback(null, data);
            } else {
                callback({message: "Error fetching Question Paper!!!"}, null);
            }
          }
      });
    },
}

module.exports = exam_manager;