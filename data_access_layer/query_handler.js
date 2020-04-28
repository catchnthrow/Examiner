var mysql = require('mysql');
var connection_config = require('../server/config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);

var queryHandler = {

    singleInsertQuery : function(query, data, callback){
        mysql_pool.getConnection(function(err, connection) {
            if(err != undefined){
                console.log(err);
                callback(err, null);
            } else {
            connection.query(query, data, function (error, result) {
                console.log("insert complete");
                if (error){
                    console.log(error);
                    callback(error, null);
                }
                connection.release();
                if(result != undefined && result.insertId != undefined){                   
                    console.log("result : ", result);
                    data.id = result.insertId;
                    callback(null, data);
                }
            });
            }
        });
    },

    executeSelectQuery : function(query, callback){
        
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
    }
}

module.exports = queryHandler;