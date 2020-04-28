var mysql = require('mysql');
var connection_config = require('../server/config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);
var async = require('async');

var student = {
    addNewStudent : function(userInfo, callback){
        if(userInfo.createdUser == null || !userInfo.isUserCreated){
            console.log("Student Not created. userInfo : ", userInfo);
            callback("Student Not created", userInfo);
            return;
        }

        var studentInfo = {
            user_id : userInfo.createdUser.id,
            //batch_id: userInfo,
            registration_start_date: userInfo.createdUser.registration_date,
            registration_end_date: userInfo.createdUser.registration_validity
        }

        var query = `insert into student (user_id, registration_start_date, registration_end_date) values 
                    (`+ userInfo.createdUser.id +`,'`+userInfo.createdUser.registration_date+`','`+userInfo.createdUser.registration_validity+`')`;
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
            connection.query(query, function (error, results, fields) {
                if (error) throw error;
                connection.release();
                //console.log("results : ", results);
                if(results != undefined && results.insertId != undefined && results.insertId > 0) {
                    userInfo.isStudentCreated = true;
                    studentInfo.id = results.insertId;
                    userInfo.createdStudent = studentInfo;
                    console.log('Student Created!!!. userInfo');
                    callback(null, userInfo);
                }
                else {
                    userInfo.isStudentCreated = false;
                    userInfo.createdStudent = null;
                    callback(null, userInfo);
                }           
            });
            }
        });
    },

    getStudent : function(userInfo, callback){
        if(userInfo != null && userInfo != undefined  && userInfo.id > 0) {
           var query = `SELECT * FROM student WHERE user_id = ` + userInfo.id + `;`;
           mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
            connection.query(query, function (error, results, fields) {
                if (error) throw error;
                connection.release();
                //console.log(results);
                if(results != undefined && results.length > 0) {
                    userInfo.student = results[0]
                    callback(null, userInfo);
                }
                else {
                    callback(null, null);
                }           
            });
            }
        });
        } else {
            callback("Invalid userInfo. Can't find student!!!", null);
        }
    }
}

module.exports = student;