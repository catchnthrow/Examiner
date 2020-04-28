const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var connection_config = require('../config.js').mysql_connection;
var mysql_pool = mysql.createPool(connection_config);
var XLSX = require('xlsx');
var passport = require("passport");
var questionPaperManager = require('../../managers/question_paper_manager');
var examManager = require('../../managers/exam_manager');
var batchComponent = require('../../data_access_layer/batch');
var async = require('async');
var multer = require('multer');
var upload = multer({storage : storage}).single('file');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/uploads/question-papers-xls')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  });


/* GET api listing. */
router.get('/', (req, res) => {
    console.log(req.body);
  res.send('api works');
});

router.post('/check', passport.authenticate('jwt', {session: false}), function(req, res){
    console.log("Asdfasdfasdfsdfasdfd");
    //console.log(req.user);
    res.json(req.user);
    // res.send("jwt works");
});

router.post('/uploadquestionpaper', passport.authenticate('jwt', {session: false}), (req, res) => {
    console.log("Upload Question Paper called");
    var workbook = XLSX.readFile('C:/Projects/Examiner/resources/excel_uploads/test.xlsx');
    var sheet_name_list = workbook.SheetNames;
    
    //xlData.forEach(element => {
        async.waterfall([
            async.apply(questionPaperManager.fnUplaodNewQuestionPaper, req)
        ],
        function(err, data){
            if(err != undefined && err != null)
            {
                res.json("Failure");
            }
            else{
                //console.log(data);
                //res.json("Success");
                res.json(data);                
            }
        })
    //});


    //console.log(xlData[0]);
});

router.get('/download/:filename', passport.authenticate('jwt', {session: false}), function(req, res, next){
    var filename = req.params.filename;
    var file_path = "downloadable/" + filename;
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.download(file_path);
    res.setHeader("Set-Cookie", ["fileDownload=true", "path=/"]);
});

router.post('/addNewQuestionPaper', passport.authenticate('jwt', {session: false}), function(req, res, next){
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            res.json({"error":"An error occurred when uploading"});  
            return;
        }
        console.log(req.body);
        console.log(req.file);
        if(req.file){
            if(req.file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                
                async.waterfall([
                    async.apply(questionPaperManager.fnUplaodNewQuestionPaper, req)
                ],
                function(err, data){
                    if(err != undefined && err != null)
                    {
                        res.status(500).json("Failure");
                    }
                    else{
                        //console.log(data);
                        //res.json("Success");
                        res.json(data);                
                    }
                })
            } else {
                res.json({"error":"No files attached."});
            }
        }
    });
});

router.get('/previewExam?:id', passport.authenticate('jwt', { session:false})
      , (req, res) => {
  console.log("previewExam api hit!!!");
  async.waterfall([
    async.apply(examManager.adminExamPreview, req)
  ], function(err, data){
    if(err != null){
      res.status(500).json({message: err});
    } else {
      console.log(data);
      if(null != data && data != undefined){
        res.status(200).json({questionPaper : data});
      } else {
        res.status(200).json({message: "Error fetching Question Paper!!!"});
      }
    }
  });
});

router.get('/myQuestionPapers', passport.authenticate('jwt', { session:false}), (req, res) => {
  console.log('myQuestionPapers called');
  async.waterfall([
    async.apply(questionPaperManager.getQuestionPapersByAuthor, req)
  ], function(err, data){
    if(err != null){
        res.status(500).json({message: err});
    } else {
      console.log(data);
      if(null != data && data != undefined && data.length > 0){
        res.status(200).json({questionPaperList : data});
      } else {
        res.status(200).json({message: "No question papers added by you."});
      }
    }
  });
});

router.get('/allBatches', passport.authenticate('jwt', { session:false}), (req, res) => {
  console.log('allBatches called');
  async.waterfall([
    async.apply(batchComponent.getAllBatches, req)
  ], function(err, data){
    if(err != null){
        res.status(500).json({message: err});
    } else {
      console.log(data);
      if(null != data && data != undefined && data.length > 0){
        res.status(200).json({batchList : data});
      } else {
        res.status(200).json({message: "No question papers added by you."});
      }
    }
  });
});

router.get('/getBatchesForExamScheduling', passport.authenticate('jwt', { session:false}), (req, res) => {
  console.log('getBatchesForExamScheduling called');
  async.waterfall([
    async.apply(batchComponent.getBatchesForExamScheduling, req)
  ], function(err, data){
    if(err != null){
        res.status(500).json({message: err});
    } else {
      console.log(data);
      if(null != data && data != undefined && data.length > 0){
        res.status(200).json({batchList : data});
      } else {
        res.status(200).json({message: "No batches available."});
      }
    }
  });
});

router.post('/scheduleExam', passport.authenticate('jwt', {session: false}), (req, res) => {
  console.log("scheduleExam API called");
  async.waterfall([
    async.apply(examManager.createExamSchedule, req)
  ], function(err, data){
    if(err != null){
      res.status(500).json(err);
    } else {
      console.log(data);
      if(null != data && data != undefined){
        res.status(200).json(data);
      } else {
        res.status(200).json({message: "Error creating  exam schedule!!!"});
      }
    }
  });
});

router.post('/addBatch', passport.authenticate('jwt', {session: false}), (req, res) => {
  console.log("addBatch API called");
  async.waterfall([
    async.apply(batchComponent.addBatch, req)
  ], function(err, data){
    if(err != null){
      res.status(500).json(err);
    } else {
      console.log(data);
      if(null != data && data != undefined){
        res.status(200).json(data);
      } else {
        res.status(200).json({message: "Error creating new Batch !!!"});
      }
    }
  });
});

module.exports = router;