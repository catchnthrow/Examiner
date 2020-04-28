var async1 = require('async');
var queryHandler = require('../data_access_layer/query_handler');
var utils = require('../utils/utils');
var async = require('async');
var batch = {

    addBatch : function(req, callback){
        console.log("batch.addBatch() called.");

        var query = `INSERT INTO batch set ?`;
        var newBatch = {
            batch_name : req.body.batchData.name,
            batch_start_date : req.body.batchData.startDate,
            batch_end_date : req.body.batchData.endDate
        }
        async.waterfall([
            async.apply(queryHandler.singleInsertQuery, query, newBatch)
        ],
        function(err, data){
            utils.handleComponentsCallback(err, data, callback);
        });
    },

    getAllBatches : function(req, callback) {
        console.log("batch.getAllBatches() called.");
        var query = `SELECT * FROM batch`;
        //var query = `SELECT * FROM batch WHERE CURDATE() BETWEEN batch_start_date AND batch_end_date`;

        async.waterfall([
            async.apply(queryHandler.executeSelectQuery, query)
        ],
        function(err, data){
            utils.handleComponentsCallback(err, data, callback);
        });
    },

    getBatchesForExamScheduling : function(req, callback) {
        var query = `SELECT * FROM batch
                         WHERE CURDATE() BETWEEN batch_start_date AND batch_end_date
                         AND id NOT IN (
                                SELECT batch_id 
                                FROM student_exam_mapping 
                                WHERE question_paper_id = `+req.query.qpId+` 
                                AND batch_id IS NOT NULL)`;
        async.waterfall([
            async.apply(queryHandler.executeSelectQuery, query)
        ],
        function(err, data){
            utils.handleComponentsCallback(err, data, callback);
        });
    }
}

module.exports = batch;