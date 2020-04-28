var mysql = require('mysql');
var connection_config = require('../server/config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);
var questionCategory = require('../data_access_layer/question_category');
var answer = require('../data_access_layer/answer');
var async = require('async');

var question = {
    fnInsertNewQuestionInternal : function(element, callback){
        var question = {
            id : -1
        } 
        question.para1 = element.QuestionPara1;
        question.para2 = element.QuestionPara2;
        question.categoryId = questionCategory.fnGetCategoryId(element.Category);
        question.answerIds = answer.fnGetAnswerIds(element);
        question.rightAnswerIds = answer.fnGetRightAnswerIds(element);

        //console.log("in question.fnInsertNewQuestionInternal");
        //console.log("question : ", question);
        var query = "INSERT INTO question SET ?";
        //console.log("query : ", query);
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
            connection.query(query, {question_type_id : 1
                                    , question_category_id : question.categoryId 
                                    , question_para1 : question.para1
                                    , question_para2 : question.para2
                                    , answer_ids : question.answerIds
                                    , right_answer_ids : question.rightAnswerIds}, function (error, result) {
                //console.log("insert complete");
                if (error){
                    console.log(error);
                    callback(error, null);
                }
                connection.release();
                if(result != undefined && result.insertId != undefined){
                   
                    //console.log("result : ", result);
                    question.id = result.insertId;
                    callback(null, question);
                }
            });
            }
        });
    },
    fnInsertQuestion : function(element, callback)
    {
        //console.log("answer.fnInsertQuestions ");
        //console.log("element : ", element);
        //var tempElement = element;
        async.parallel({
            question : question.fnInsertNewQuestionInternal.bind(null, element)
        },
        function(err, data){
            //console.log("data: ",data);
            //console.log("err: ",err);
            //element.question = data.question;
            //console.log("question element: ", element);
            if(data != undefined && data.question != undefined)
                callback(err, data.question);
            else
                callback(err, data);
        })        
    }
}

module.exports = question;