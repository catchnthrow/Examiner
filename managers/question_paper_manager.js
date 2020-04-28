var async = require('async');
var each = require('async/each');
var answer = require('../data_access_layer/answer');
var question = require('../data_access_layer/question');
var questionPaper = require('../data_access_layer/question_paper');
var quesPaperQuesMapping = require('../data_access_layer/question_paper_question_mapping');
var XLSX = require('xlsx');
var moment = require('moment');
var mysql = require('mysql');
var connection_config = require('../server/config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);
var _ = require('underscore');

var questionPaperManager = {
    
    fnUplaodNewQuestionPaper : function(req, callback) {

        console.log("inside questionPaperManager.fnUplaodNewQuestionPaper()");
        var workbook = XLSX.read(req.file.buffer);
        var sheet_name_list = workbook.SheetNames;
        var qp = JSON.parse(req.body.questionPaper);
        console.log("------------------inside questionPaperManager.fnUplaodNewQuestionPaper() sheet_name_list : ", sheet_name_list);
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        console.log("------------------inside questionPaperManager.fnUplaodNewQuestionPaper() xlData : ",xlData);
        //console.log(req.body);
        //console.log(moment(req.body.available_date));
        console.log("questionPaper : ", qp);
        
        var questionPaperDraft = {
            paper_title : qp.title,
            course_name : qp.courseName,
            total_time_in_secs : qp.duration * 60,
            author_id : req.user.id
        }

        var instruction = qp.instruction;
        var inst = '';
        inst = ':head:' + instruction.heading + ':head:'
              + '|'
              + ':subhead:' + instruction.subheading + ':subhead:'
              + '|';
    
        for(var i = 0; i < instruction.instructions.length; i++) {
          inst += ':li:' + instruction.instructions[i] + ':li:|'; 
        }
        
        inst += ':specialnotes:' + instruction.specialNotes + ':specialnotes:|';

        questionPaperDraft.instructions = inst;

        var question_paper = null;
        async.waterfall([
            function(cb){
                async.parallel({
                //To insert Question Paper details
                quesPprInserted : questionPaper.fnAddNewQuestionPaper.bind(null, questionPaperDraft),
                //To insert question and its option answers details
                questionList : function(callback){
                    console.log("Inside fnUplaodNewQuestionPaper parallel to insert question");
                    var quesList = [];
                    //Loop thru each question
                    async.each(xlData, function(element, cb){                    
                        async.waterfall([
                            //Insert option answers
                            async.apply(answer.fnInsertAnswers, element),
                            //Insert question
                            question.fnInsertQuestion
                        ],function(err, q){
                            //console.log('question created');
                            //console.log("data : ", q);
                            quesList.push(q);
                            cb();
                        });  
                                    
                    },function(err){
                        if( err ) {
                            console.log('Error occured while creating questions and answers option');
                        } else {
                            console.log('All questions created.');
                            callback(null, quesList);
                        }
                    });
                }
            }, function(err, data){
                //console.log("question_paper inserted : ", data);
                if(err != null){
                    console.log(err);
                }
                else{
                    console.log("Final Callback for question creation.");
                    data.quesPprInserted.questionsList = data.questionList;
                    question_paper = data.quesPprInserted;
                    //console.log("question_paper inserted : ", data.quesPprInserted);
                    cb(null, data.quesPprInserted);
                    //console.log(data.questionPaperFinal);   
                }           
            });
        },
        quesPaperQuesMapping.fnInsertQuestionPaperQuestionMapping
        ],  function(err, data){
            console.log("Final Callback after question_paper question mapping done.");
            if(err != null){
                console.log(err);
                callback(err, null);
            } else
                callback(null, data);
        });
    },

    getAvailableExamsList : function(req, callback){
        var query = `SELECT student.id
                        , question_paper.id
                        , question_paper.paper_title
                        , question_paper.instructions
                        , CASE WHEN exam_status.status_name IS NULL THEN "Not Registered" ELSE exam_status.status_name END AS status_name
                        , student_exam_mapping.available_till
                    FROM user
                    INNER JOIN student ON student.user_id = user.id
                    INNER JOIN batch ON batch.id = student.batch_id
                    INNER JOIN student_exam_mapping ON batch.id = student_exam_mapping.batch_id
                    INNER JOIN question_paper ON question_paper.id = student_exam_mapping.question_paper_id
                    LEFT OUTER JOIN student_exam_history ON student_exam_history.student_id = student.id AND student_exam_history.question_paper_id = question_paper.id
                    LEFT OUTER JOIN exam_status ON exam_status.id = student_exam_history.exam_status_id
                    WHERE user.id = ` + req.user.id + `
                    AND (CURDATE() BETWEEN student_exam_mapping.available_from AND student_exam_mapping.available_till
                        AND (exam_status.id IN (1, 2) OR exam_status.id IS NULL))
                    or (exam_status.id = 3)`;

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
                connection.release();
                if(result != undefined){
                    callback(null, result);
                }
            });
            }
        });
    },

    getQuestionPapersByAuthor : function(req, callback){
        var query = `SELECT teacher.id
            , question_paper.id
            , question_paper.paper_title
            , question_paper.instructions
            FROM user
            INNER JOIN teacher ON teacher.user_id = user.id
            INNER JOIN question_paper ON question_paper.author_id = teacher.user_id
            WHERE user.id = ` + req.user.id + `;`;

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
                connection.release();
                if(result != undefined){
                    callback(null, result);
                }
            });
            }
        });
    },

    getQuestionPaperById : function(questionPaperId, isIncludeCorrectAnswer, user, cb){
        var indx = 1;
        console.log("-------------------getQuestionPaperById called. questionPaperId : ", isIncludeCorrectAnswer);

        /*current query only works when the student taking exam belongs to a batch
        and while scheduling the exam, teacher schedules the exam for that batch. 
        If the exam is scheduled for a single student this below query does not handle that scenario. 
        THis is TODO functionality*/
        var query = ` SELECT DISTINCT
        question_paper.id AS question_paper_id,
        CASE WHEN 
            student_exam_history.time_left_in_secs is null 
            THEN question_paper.total_time_in_secs 
            ELSE student_exam_history.time_left_in_secs 
            END as total_time_in_secs,        
        question.id AS question_id,
        question.question_para1,
        question.question_para2,
        `;

        if(isIncludeCorrectAnswer === true){
            query += `question.right_answer_ids,`;
        }
        
        query += `question_types.question_type,
        question_category.category_name,
        answer.id AS answer_id,
        answer.answer_text
        FROM
        question_paper
        INNER JOIN question_paper_question_mapping ON question_paper_question_mapping.question_paper_id = question_paper.id
        INNER JOIN question ON question.id = question_paper_question_mapping.question_id
        INNER JOIN question_types ON question_types.id = question.question_type_id
        INNER JOIN question_category ON question_category.id = question.question_category_id
        INNER JOIN answer ON FIND_IN_SET(answer.id, question.answer_ids)
        INNER JOIN student_exam_mapping ON student_exam_mapping.question_paper_id = question_paper.id
        INNER JOIN batch ON batch.id = student_exam_mapping.batch_id
        INNER JOIN student ON student.batch_id = batch.id
        LEFT OUTER JOIN student_exam_history on student_exam_history.student_id = student.id
        WHERE student.user_id = ` + user.id + ` AND question_paper.id = ` + questionPaperId + `;`;
        console.log("query : ", query);
        mysql_pool.getConnection(function(err, connection) {
            //console.log("query returned");

            if(err != undefined) {
                console.log(err);
                cb(err, null);
            } else {
            connection.query(query, function (error, result) {
                //console.log(result);
                if (error) {
                    console.log(error);
                    cb(error, null);
                }
                connection.release();
                if(result != undefined && result.length > 0) {
                    var questionPaper = {
                        id: result[0].question_paper_id,
                        totalTime: result[0].total_time_in_secs
                    };

                    var categories = _.groupBy(result,function(item){ return item.category_name});
                    //console.log('categories : ', result);
                    var quesCategories = new Array();
                    Object.keys(categories).forEach(function(k, i){
                        //console.log('category name : ', k);
                        var categoryName = k;
                        var quesList = new Array();
                        var questionGroup = _.groupBy(categories[k],function(x){ return x.question_id});

                        Object.keys(questionGroup).forEach(function(key,index) {
                            var answers = _.map(questionGroup[key], function(a){ return { id : a.answer_id, text : a.answer_text}});
                            //console.log("questionGroup[key].question_id : " , questionGroup[key][0].question_id);
                            var question = {
                                sno: indx++,
                                id : questionGroup[key][0].question_id,
                                para1 : questionGroup[key][0].question_para1,
                                para2 : questionGroup[key][0].question_para2,
                                correctAnsIds : questionGroup[key][0].right_answer_ids,
                                type : questionGroup[key][0].question_type,
                                category : questionGroup[key][0].category_name
                            }
                            question.answers = answers;
                            //console.log("question : ", question);
                            quesList.push(question);                            
                        });

                        quesCategories.push({
                            name : categoryName,
                            questions : quesList
                        });
                    });
                    //questionPaper.questions = new Array();
                    questionPaper.categories = quesCategories;
                    cb(null, questionPaper);
                } else {
                    console.log('No results found.');
                }
            });
            }
        });
    },

    getQuestionPaperByIdForAdminPreview : function(questionPaperId, user, cb){
        var indx = 1;
        console.log("getQuestionPaperById called for ADMIN. questionPaperId : ", questionPaperId);
        var query = `SELECT DISTINCT 
        question_paper.id AS question_paper_id,
        question_paper.total_time_in_secs,
        question.id AS question_id,
        question.question_para1,
        question.question_para2,
        question_types.question_type,
        question_category.category_name,
        answer.id AS answer_id,
	    answer.answer_text
        FROM 
        question_paper
        INNER JOIN question_paper_question_mapping ON question_paper_question_mapping.question_paper_id = question_paper.id
        INNER JOIN question ON question.id = question_paper_question_mapping.question_id
        INNER JOIN question_types ON question_types.id = question.question_type_id
        INNER JOIN question_category ON question_category.id = question.question_category_id
        INNER JOIN answer ON FIND_IN_SET(answer.id, question.answer_ids)
        WHERE question_paper.id = ` + questionPaperId + `;`;
        console.log("query : ", query);
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined) {
                console.log(err);
                cb(err, null);
            } else {
            connection.query(query, function (error, result) {
                console.log("result : ", result);
                console.log("error : ", error);
                if (error) {
                    console.log(error);
                    cb(error, null);
                }
                connection.release();
                if(result != undefined && result.length > 0) {
                    var questionPaper = {
                        id: result[0].question_paper_id,
                        totalTime: result[0].total_time_in_secs
                    };

                    var categories = _.groupBy(result,function(item){ return item.category_name});
                    //console.log('categories : ', result);
                    var quesCategories = new Array();
                    Object.keys(categories).forEach(function(k, i){
                        //console.log('category name : ', k);
                        var categoryName = k;
                        var quesList = new Array();
                        var questionGroup = _.groupBy(categories[k],function(x){ return x.question_id});

                        Object.keys(questionGroup).forEach(function(key,index) {
                            var answers = _.map(questionGroup[key], function(a){ return { id : a.answer_id, text : a.answer_text}});
                            //console.log("questionGroup[key].question_id : " , questionGroup[key][0].question_id);
                            var question = {
                                sno: indx++,
                                id : questionGroup[key][0].question_id,
                                para1 : questionGroup[key][0].question_para1,
                                para2 : questionGroup[key][0].question_para2,
                                type : questionGroup[key][0].question_type,
                                category : questionGroup[key][0].category_name
                            }
                            question.answers = answers;
                            //console.log("question : ", question);
                            quesList.push(question);                            
                        });

                        quesCategories.push({
                            name : categoryName,
                            questions : quesList
                        });
                    });
                    //questionPaper.questions = new Array();
                    questionPaper.categories = quesCategories;
                
                    
                    cb(null, questionPaper);
                } else {
                    cb({"error":"no data found"}, null);
                }
            });
            }
        });
    }
}

module.exports = questionPaperManager;