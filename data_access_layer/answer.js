var mysql = require('mysql');
var connection_config = require('../server/config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);
var async1 = require('async');

var answer = {
    fnInsertNewAnswerInternal : function(answer, callback){
        var option = {
            answer : answer,
            id: -1
        }
        //console.log("in answer.fnInsertNewAnswerInternal");
        //console.log("asnwer : ", answer);
        var query = "INSERT INTO answer SET ?";
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
            connection.query(query, {answer_text : answer}, function (error, result) {
                //console.log("insert complete");
                if (error){
                    console.log(error);
                    callback(error, null);
                }
                connection.release();
                if(result != undefined && result.insertId != undefined){
                   
                    //console.log("result : ", result);
                    option.id = result.insertId;
                    callback(null, option);
                }
            });
            }
        });
    },
    fnInsertAnswers : function(element, callback)
    {
        //console.log("answer.fnInsertAnswers ");
        //console.log("element : ", element.Option1);
        //var tempElement = element;
        async1.parallel({
            option1 : answer.fnInsertNewAnswerInternal.bind(null, element.Option1),
            option2 : answer.fnInsertNewAnswerInternal.bind(null, element.Option2), 
            option3 : answer.fnInsertNewAnswerInternal.bind(null, element.Option3), 
            option4 : answer.fnInsertNewAnswerInternal.bind(null, element.Option4)
        },
        function(err, data){
            //console.log("data: ",data);
            //console.log("err: ",err);
            element.Option1 = data.option1;
            element.Option2 = data.option2;
            element.Option3 = data.option3;
            element.Option4 = data.option4;

            //console.log("element1: ", element);
            callback(err, element);
        })        
    },

    fnGetAnswerIds : function(element){
        var ids = "";

        if(element.Option1 != undefined){
            ids += "," + element.Option1.id;
        }
        if(element.Option2 != undefined){
            ids += "," + element.Option2.id;
        }
        if(element.Option3 != undefined){
            ids += "," + element.Option3.id;
        }
        if(element.Option4 != undefined){
            ids += "," + element.Option4.id;
        }
        ids += ",";
        return ids;
    },

    fnGetRightAnswerIds : function(element){

        if(element.CorrectOption != undefined) {
            switch(element.CorrectOption) {
                case 'Option1' :
                    return element.Option1.id;
                case 'Option2':
                    return element.Option2.id;
                case 'Option3':
                    return element.Option3.id;
                case 'Option4':
                    return element.Option4.id;
            }
        }
    }
}

module.exports = answer;