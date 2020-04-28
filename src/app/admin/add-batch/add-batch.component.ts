import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-add-batch',
  templateUrl: './add-batch.component.html',
  styleUrls: ['./add-batch.component.css']
})
export class AddBatchComponent implements OnInit {

  constructor(
    private router : Router,
    private http: HttpClient
  ) { }

  public submitError = false;
  public submitted = false;
  public dateFrom;
  public dateTo;
  public batchName;

  ngOnInit() {
  }

  resetValues(){
    this.batchName = undefined;
    this.dateFrom = undefined;
    this.dateTo = undefined;
  }

  submit(){
    this.submitted = true;
    if(this.batchName != null && this.batchName != undefined && this.batchName.length > 0
      && this.dateFrom != null && this.dateFrom != undefined
      && this.dateTo != null && this.dateTo != undefined) {
        var fromDate = moment(this.dateFrom.year + '-' + this.dateFrom.month + '-' + this.dateFrom.day, "YYYY-MM-DD");
        var toDate = moment(this.dateTo.year + '-' + this.dateTo.month + '-' + this.dateTo.day, "YYYY-MM-DD");

        console.log(this.dateFrom);
        console.log(this.dateTo);
        var batchData = {
          name : this.batchName,
          startDate : fromDate.format("YYYY-MM-DD"),
          endDate : toDate.format("YYYY-MM-DD"),
        }
        if(fromDate.isValid() && toDate.isValid()) {
          this.http.post('/admin/addBatch', {batchData:batchData})
          .subscribe(
            (response : any) => {
              this.submitError = false;
              console.log("response : ", response);
              this.resetValues();
              setTimeout(function() {this.submitted = false;}, 10000);
            },
            (error : any) => {
              this.submitError = true;
              console.log("error : ", error);
              setTimeout(() => this.submitted = false, 10000);
            }
          )
        } else {
          this.submitError = false; 
          setTimeout(() => this.submitted = false, 10000);
        }     
      } else {
        this.submitError = true;
        setTimeout(() => this.submitted = false, 10000);
      }
  }
}
