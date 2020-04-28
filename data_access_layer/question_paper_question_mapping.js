var mysql = require('mysql');
var connection_config = require('../server/config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);
var async = require('async');

var questionPaperQuestionMapping = {
    fnInsertQuestionPaperQuestionMapping : function(questionPaper, callback){
        console.log("fnInsertQuestionPaperQuestionMapping questionPaper : ", questionPaper);
        async.each(questionPaper.questionsList, function(ques, cb){
            console.log("-------------------------------------------in questionPaperQuestionMapping.fnInsertQuestionPaperQuestionMapping");
            var query = "INSERT INTO question_paper_question_mapping SET ?";
            mysql_pool.getConnection(function(err, connection) {
                if(err != undefined){
                    //console.log(err);
                    cb(err, null);
                } else {
                connection.query(query, {question_paper_id:questionPaper.id, question_id:ques.id}, function (error, result) {
                    if (error){
                        //console.log(error);
                        cb(error, null);
                    }
                    connection.release();
                    if(result != undefined && result.insertId != undefined){                   
                        console.log("result : ", result);
                        //questionPaper.id = result.insertId;
                        cb(null);
                    }
                });
                }
            });
        }, function(err){
            if( err != null ) {
                console.log('Error occured while inserting question_paper to question mapping');
              } else {
                console.log('QuestionPaper question mapping complete.');
                callback(null, questionPaper);
              }
        });        
    }
}

module.exports = questionPaperQuestionMapping;