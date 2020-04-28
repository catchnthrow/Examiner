var mysql = require('mysql');
var connection_config = require('../server/config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);
var async1 = require('async');

var studentExamMapping = {
    createNewMapping : function(mappingData, callback){
        console.log("mappingData : ", mappingData);
        var query = `INSERT INTO student_exam_mapping SET ?`;
        var inputData = {
            batch_id : mappingData.batchId,
            student_id : null,
            question_paper_id : mappingData.questionPaperId,
            available_from : mappingData.fromDate,
            available_till : mappingData.toDate
        }

        mysql_pool.getConnection(function(err, connection){
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
                connection.query(query, inputData, function (error, result) {
                    if (error){
                        console.log(error);
                        callback(error, null);
                        return;
                    }
                    connection.release();
                    if(result != undefined && result.insertId != undefined && result.insertId > 0){        
                        console.log("result : ", result);
                        inputData.id = result.insertId;
                        callback(null, inputData);                    
                    } else {
                        callback({message: "Error"}, null);
                    }
                });
            }
        });
    }
}

module.exports = studentExamMapping;