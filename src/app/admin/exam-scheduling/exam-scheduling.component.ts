import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-exam-scheduling',
  templateUrl: './exam-scheduling.component.html',
  styleUrls: ['./exam-scheduling.component.css']
})
export class ExamSchedulingComponent implements OnInit {

  public qpList;
  public batchList;
  public errorOnPage;
  public selectedQP;
  public selectedBatch;
  public dateFrom;
  public dateTo;


  public submitError = false;
  public submitted = false;

  constructor(
    private router : Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.http.get("/admin/myQuestionPapers", {responseType:'json'})
    .subscribe(
      (response : any) => {
        console.log("response of quesitonPapers API response : ", response);
        this.qpList = response.questionPaperList;
      },
      (error : any) => {
        console.log(error);
        this.errorOnPage = error;
      }
    );
  }

  onSelectQP(qp){
    this.selectedQP = qp;
    console.log('selected question paper : ', qp);
    this.http.get("/admin/getBatchesForExamScheduling?qpId="+qp.id, {responseType:'json'})
    .subscribe(
      (response : any) => {
        console.log("response of quesitonPapers API response : ", response);
        this.batchList = response.batchList;
      },
      (error : any) => {
        console.log(error);
        this.errorOnPage = error;
      }
    );
  }

  onSelectBatch(batch){
    this.selectedBatch = batch;
    console.log("selected batch : ", batch);
  }

  resetValues(){
    this.selectedBatch = null;
    this.selectedQP = null;
    this.dateFrom = null;
    this.dateTo = null;
  }

  submit(){
    
    this.submitted = true;
    if(this.selectedQP != null && this.selectedQP != undefined
    && this.selectedBatch != null && this.selectedBatch != undefined
    && this.dateFrom != null && this.dateFrom != undefined
    && this.dateTo != null && this.dateTo != undefined) {
      var fromDate = moment(this.dateFrom.year + '-' + this.dateFrom.month + '-' + this.dateFrom.day, "YYYY-MM-DD");
      var toDate = moment(this.dateTo.year + '-' + this.dateTo.month + '-' + this.dateTo.day, "YYYY-MM-DD");
      var scheduleData = {
        questionPaperId : this.selectedQP.id,
        batchId : this.selectedBatch.id,
        fromDate : fromDate.format("YYYY-MM-DD"),
        toDate : toDate.format("YYYY-MM-DD")
      }
      if(fromDate.isValid() && toDate.isValid()){
        this.http.post('/admin/scheduleExam', {scheduleData:scheduleData})
        .subscribe(
          (response : any) => {
            this.submitError = false;
            this.resetValues();
            console.log("response : ", response);
          },
          (error : any) => {
            this.submitError = true;
            console.log("error : ", error);
          }
        )
      } else {
        this.submitError = false; 
      }     
    } else {
      this.submitError = true;
    }
  }


}
