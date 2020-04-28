var mysql = require('mysql');
var connection_config = require('../server/config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);
var async = require('async');

var question_paper = {
    fnAddNewQuestionPaper : function(questionPaper, callback){
        console.log("in question_paper.fnAddNewQuestionPaper");
        console.log("questionPaper : ", questionPaper);
        var query = "INSERT INTO question_paper SET ?";
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
            connection.query(query, questionPaper, function (error, result) {
                if (error){
                    console.log(error);
                    callback(error, null);
                }
                connection.release();
                if(result != undefined && result.insertId != undefined){                   
                    console.log("result : ", result);
                    questionPaper.id = result.insertId;
                    callback(null, questionPaper);
                }
            });
            }
        });
    }
}

module.exports = question_paper;