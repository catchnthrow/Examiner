var mysql = require('mysql');
var connection_config = require('../server/config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);

var answerSheet = {
    saveAnswer : function(userAnswer, userInfo, callback){
        console.log("student", userInfo);
        var query = `INSERT INTO answer_sheet SET ?`;
        var answer_sheet = {
            student_id : userInfo.student.id,
            question_id : userAnswer.questionId,
            answer_id : userAnswer.answerId,
            is_for_review : userAnswer.isMarkedForReview,
            is_question_answered : 1,
            is_for_report_issue : userAnswer.isIssueReported,
            answer_subjective : userAnswer.subjectiveAnswer
        }

        console.log("answer_sheet : ", answer_sheet);

        mysql_pool.getConnection(function(err, connection){
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
                connection.query(query, answer_sheet, function (error, result) {
                    if (error){
                        console.log(error);
                        callback(error, null);
                        return;
                    }
                    connection.release();
                    if(result != undefined && result.insertId != undefined && result.insertId > 0){        
                        console.log("result : ", result);
                        callback(null, {message: "Success"});                    
                    } else {
                        callback({message: "Error"}, null);
                    }
                });
            }
        });
    },
    updateAnswer : function(userAnswer, userInfo, callback){
        var query = `UPDATE answer_sheet SET ? WHERE question_id = `
        + userAnswer.questionId +` AND student_id =` + userInfo.student.id + `;`;
        var answer_sheet = {
            student_id : userInfo.student.id,
            question_id : userAnswer.questionId,
            answer_id : userAnswer.answerId,
            is_for_review : userAnswer.isMarkedForReview,
            is_question_answered : 1,
            is_for_report_issue : userAnswer.isIssueReported,
            answer_subjective : userAnswer.subjectiveAnswer
        }

        console.log("answer_sheet : ", userAnswer);

        mysql_pool.getConnection(function(err, connection){
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
                connection.query(query, answer_sheet, function (error, result) {
                    if (error){
                        console.log(error);
                        callback(error, null);
                        return;
                    }
                    connection.release();
                    console.log("result : ", result);
                    if(result != undefined && result.affectedRows != undefined && result.affectedRows > 0){        
                        console.log("result : ", result);
                        callback(null, {message: "Success"});                    
                    } else {
                        callback({message: "Error"}, null);
                    }
                });
            }
        });
    },
    deleteAnswer : function(questionId, userInfo, callback){
        var query = `DELETE FROM answer_sheet WHERE question_id = `
                    + questionId +` AND student_id =` + userInfo.student.id + `;`;
        console.log("userAnswer : ", questionId);
        mysql_pool.getConnection(function(err, connection){
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
                connection.query(query, function (error, result) {
                    if (error){
                        console.log(error);
                        callback(error, null);
                        return;
                    }
                    connection.release();
                    console.log("result : ", result);
                    if(result != undefined && result.affectedRows != undefined && result.affectedRows > 0){        
                        console.log("result : ", result);
                        callback(null, {message: "Success"});                    
                    } else {
                        callback({message: "Error"}, null);
                    }
                });
            }
        });
    },
    getAnswerSheet : function(user, questionPaperId, questionPaper, callback){
        var query = `SELECT * FROM answer_sheet 
        INNER JOIN question_paper_question_mapping ON answer_sheet.question_id = question_paper_question_mapping.question_id
        INNER JOIN question_paper ON question_paper.id = question_paper_question_mapping.question_paper_id
        WHERE student_id = `+ user.student.id +` AND question_paper.id = `+ questionPaperId +`;`;
                
        console.log('answerSheet query : ', query);
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
                connection.query(query, function (error, result) {
                    if (error){
                        console.log(error);
                        callback(error, null);
                    }
                    //console.log("questionPaper.answersheet : ", questionPaper.usersAnswers);
                    connection.release();
                    if(result != undefined && result.length > 0){   
                        var ansList = new Array();
                        result.forEach(ans => {
                            ansList.push({
                                questionId : ans.question_id,
                                answerId : ans.answer_id,
                                isMarkedForReview : ans.is_for_review,
                                isIssueReported : ans.is_for_report_issue,
                                subjectiveAnswer : ans.answer_subjective
                            });
                        });     
                        questionPaper.usersAnswers = ansList;                    
                    } else if(result != undefined && result.length == 0) {
                        questionPaper.usersAnswers = null;
                    }                      
                    callback(null, questionPaper);
                });
            }
        });
    },
    getAnswerSheetForAdminPreview : function(user, questionPaperId, questionPaper, callback){
        var query = `SELECT * FROM answer_sheet 
        INNER JOIN question_paper_question_mapping ON answer_sheet.question_id = question_paper_question_mapping.question_id
        INNER JOIN question_paper ON question_paper.id = question_paper_question_mapping.question_paper_id
        WHERE question_paper.id = `+ questionPaperId +`;`;
                
        console.log('answerSheet query : ', query);
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
                connection.query(query, function (error, result) {
                    if (error){
                        console.log(error);
                        callback(error, null);
                    }
                    console.log("questionPaper.answersheet : ", questionPaper.usersAnswers);
                    connection.release();
                    if(result != undefined && result.length > 0){   
                        var ansList = new Array();
                        result.forEach(ans => {
                            ansList.push({
                                questionId : ans.question_id,
                                answerId : ans.answer_id,
                                isMarkedForReview : ans.is_for_review,
                                isIssueReported : ans.is_for_report_issue,
                                subjectiveAnswer : ans.answer_subjective
                            });
                        });     
                        questionPaper.usersAnswers = ansList;                    
                    } else if(result != undefined && result.length == 0) {
                        questionPaper.usersAnswers = null;
                    }
                      
                    callback(null, questionPaper);
                });
            }
        });
    }
}

module.exports = answerSheet;