var mysql = require('mysql');
var connection_config = require('../server/config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);
var async1 = require('async');

var activityTracker = {
    fnSaveActivity : function(activity, connection, callback){
        var actvt = {
            id = -1,
            user_id = activity.user_id,
            activity_type_id = activity.type_id,
            activity_target_id = activity.target_id,
            activity_datetime = activity.datetime
        }
        console.log("in activity.fnSaveActivity");
        console.log("activity : ", actvt);
        var query = "INSERT INTO activty_tracker SET ?";
        connection.query(query, actvt, function (error, result) {
            console.log("insert complete");
            if (error){
                console.log(error);
                callback(error, null);
            }
            connection.release();
            if(result != undefined && result.insertId != undefined){
               
                console.log("result : ", result);
                actvt.id = result.insertId;
                callback(null, actvt);
            }
        });
    }
}

module.exports = activityTracker;