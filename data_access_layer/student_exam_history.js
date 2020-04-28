var mysql = require('mysql');
var connection_config = require('../server/config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);
var questionCategory = require('../data_access_layer/question_category');
var answer = require('../data_access_layer/answer');
var async = require('async');
var moment = require('moment');

var studentExamHistory = {
    registerStudentToExam :  function(req, questionPaper, callback){

        console.log("questionPaper : ", questionPaper);
        var query = "INSERT INTO student_exam_history SET ?";
        var data ={
            student_id : req.user.student.id,
            question_paper_id : req.body.exam.id,
            start_date : null,
            exam_status_id : 1,
            end_date : null,
            time_left_in_secs : questionPaper.total_time_in_secs
        }
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
            connection.query(query, data, function (error, result) {
                if (error){
                    console.log(error);
                    callback(error, null);
                }
                connection.release();
                if(result != undefined && result.insertId != undefined){                   
                    console.log("result : ", result);
                    callback(null, questionPaper);
                }
            });
            }
        });
    },

    studentStartedExam :  function(req, notUsed, callback){
        var query = `UPDATE student_exam_history SET ? WHERE student_id = ` + req.user.student.id + ` AND question_paper_id = ` +  req.query.id + `;`;
        var data ={
            start_date : moment().format("YYYY-MM-DD HH:mm:ss"),
            exam_status_id : 2
        }
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
            connection.query(query, data, function (error, result) {
                if (error){
                    console.log(error);
                    callback(error, null);
                }
                connection.release();
                if(result != undefined && result.affectedRows != undefined && result.affectedRows > 0){                   
                    console.log("result : ", result);
                    callback(null, notUsed);
                }
            });
            }
        });
    },

    studentCompletedExam :  function(req, notUsed, callback){
        var query = `UPDATE student_exam_history SET ? WHERE student_id = ` + req.user.student.id + ` AND question_paper_id = ` +  req.body.questionPaper.id + `;`;
        var data = {
            exam_status_id : 3,
            end_date : moment().format("YYYY-MM-DD HH:mm:ss")
        }
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
            connection.query(query, data, function (error, result) {
                if (error){
                    console.log(error);
                    callback(error, null);
                }
                connection.release();
                if(result != undefined && result.affectedRows != undefined && result.affectedRows > 0){                   
                    console.log("result : ", result);
                    callback(null, {message : "Success"});
                }
            });
            }
        });
    },

    updateExamTimer : function(req, notused, callback){
        console.log("req.user:", req.user);
        var query = `UPDATE student_exam_history SET ? WHERE student_id = ` + req.user.student.id + ` AND question_paper_id = ` +  req.body.examId + `;`;
        var data = {
            time_left_in_secs : req.body.timeLeft,
        }
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
            connection.query(query, data, function (error, result) {
                if (error){
                    console.log(error);
                    callback(error, null);
                }
                connection.release();
                if(result != undefined && result.affectedRows != undefined && result.affectedRows > 0){                   
                    console.log("result : ", result);
                    callback(null, {message : "Success. Time Left updated."});
                }
            });
            }
        });
    }
}

module.exports = studentExamHistory;