var mysql = require('mysql');
var connection_config = require('../server/config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);
var async1 = require('async');
var moment = require('moment');

var login_history = {
    saveLoginActivity : function(loginData, isSuccess){
        console.log(loginData);
        if(loginData === undefined || loginData == null)
        return;
        var query = ``;
        if(isSuccess){
            query = `INSERT INTO login_history (user_id, login_date_time, is_success, email) VALUES (` + loginData.id + `,'`+ moment().format("YYYY-MM-DD HH:mm:ss") +`', ` + true + `,'`+loginData.email+`');`;
        } else {
            query = `INSERT INTO login_history (email, login_date_time, is_success) VALUES ('` + loginData.username + `','`+ moment().format("YYYY-MM-DD HH:mm:ss") +`', ` + false + `);`;
        }
        console.log(query);
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                //callback(err, null);
            } else {
            connection.query(query, function (error, results, fields) {
                if (error) throw error;
                connection.release();
                if(results != undefined && results.insertId != undefined && results.insertId > 0) {
                    console.log('login activity recorded');
                }
                else {
                    console.log('login activity NOT recorded');
                }           
            });
            }
        });
    }
}

module.exports = login_history;