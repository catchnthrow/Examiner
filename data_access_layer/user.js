var mysql = require('mysql');
var connection_config = require('../server/config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);
var questionCategory = require('../data_access_layer/question_category');
var answer = require('../data_access_layer/answer');
var async = require('async');
var moment = require('moment');

var user = {
    fnIsValidUser : function(user, callback){
        //console.log("user : ", user);
        var query = `select * from user where (email='`+user.username+`' OR username='`+user.username+`') AND password='`+user.password+`'`;
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
            connection.query(query, function (error, results, fields) {
                if (error) throw error;
                connection.release();
                if(results.length == 1) {
                    callback(null, results[0]);
                }
                else {
                    callback(error, null);
                }           
            });
            }
        });
    },
    getUserById : function (userId, callback){
        var query = `select * from user where id = '` + userId +`'`;
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
            connection.query(query, function (error, results, fields) {
                if (error) throw error;
                connection.release();
                if(results.length == 1) {
                    callback(null, results[0]);
                }
                else {
                    callback(error, null);
                }           
            });
            }
        });
    }, 
    getUserByEmailId : function(userInfo, callback){
        var query = `select * from user where email = '` + userInfo.email +`'`;
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
            connection.query(query, function (error, results, fields) {
                if (error) throw error;
                connection.release();
                if(results.length == 1) {
                    userInfo.isUserExists = true;
                    callback(null, userInfo);
                }
                else {
                    userInfo.isUserExists = false;
                    callback(null, userInfo);
                }           
            });
            }
        });
    },
    addNewUser : function(userInfo, callback){

        console.log("userInfo : ", userInfo);
        var user = {
            first_name : userInfo.first_name,
            middle_name : userInfo.middle_name, 
            last_name : userInfo.last_name, 
            email : userInfo.email, 
            mobile : userInfo.mobile, 
            username : userInfo.email, 
            password : userInfo.password, 
            registration_date : moment().format("YYYY-MM-DD HH:mm:ss"), 
            //default duration of registration is one month.
            registration_validity : moment(moment().add(1,"month")).format("YYYY-MM-DD HH:mm:ss")
        }

        console.log("user: ", user);
        var query = `INSERT INTO user (first_name,middle_name,last_name,email,mobile,username,password,registration_date,registration_validity) VALUES 
        ('`+ user.first_name + `','`+ user.middle_name + `','`+ user.last_name + `','`+ user.email + `','`+ user.mobile + `','`+ user.username + `','`+ user.password + `','`+ user.registration_date + `','`+ user.registration_validity + `')`;
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
            connection.query(query, function (error, results, fields) {
                if (error) throw error;
                connection.release();
                console.log("results.insertedId : ", results.insertId);
                if(results != undefined && results.insertId != undefined && results.insertId > 0) {
                    userInfo.isUserCreated = true;
                    user.id = results.insertId;
                    userInfo.createdUser = user;
                    console.log("User created!!! userInfo :", userInfo);
                    callback(null, userInfo);
                }
                else {
                    userInfo.isUserCreated = false;
                    userInfo.createdUser = null;
                    console.log("User NOT created!!! userInfo :", userInfo);
                    callback(null, userInfo);
                }           
            });
            }
        });
    }
}

module.exports = user;