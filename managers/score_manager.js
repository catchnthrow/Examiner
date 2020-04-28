var mysql = require('mysql');
var connection_config = require('../server/config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);
var async = require('async');
var queryHandler = require('../data_access_layer/query_handler');
var utils = require('../utils/utils');

var score_manager = {
    getScore : function(req, callback){
        var query = `SELECT 
        question_category.category_name AS CategoryName,
        COUNT(*) AS TotalQuestions,
        COUNT(CASE WHEN answer_sheet.is_question_answered = 1 THEN 1 ELSE 0 END) AS Attempted,
        SUM(CASE WHEN answer_sheet.answer_id = question.right_answer_ids THEN 1 ELSE 0 END) AS RightAnswers,
        SUM(CASE WHEN answer_sheet.answer_id = question.right_answer_ids THEN 0 ELSE 1 END) AS WrongAnswers
        FROM answer_sheet
        INNER JOIN question_paper_question_mapping ON question_paper_question_mapping.question_id = answer_sheet.question_id
        INNER JOIN student ON student.id = answer_sheet.student_id
        INNER JOIN USER ON user.id = student.user_id
        INNER JOIN question ON question.id = answer_sheet.question_id
        INNER JOIN question_category ON question_category.id = question.question_category_id
        WHERE  user.id = `+ req.user.id + ` 
        AND question_paper_question_mapping.question_paper_id = `+ req.query.id +` 
        GROUP BY question_category.id`;
        console.log('query : ' , query);
        async.waterfall([
            async.apply(queryHandler.executeSelectQuery, query)
        ],
        function(err, data){
            utils.handleComponentsCallback(err, data, callback);
        });
    }
}


module.exports = score_manager;