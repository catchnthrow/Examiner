import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css']
})
export class BatchComponent implements OnInit {

  public batchList : Array<any>;
  public futureBatchList : Array<any>;
  public runningBatchList : Array<any>;
  public oldBatchList : Array<any>;

  constructor(
    private router : Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.http.get("/admin/allBatches", {responseType:'json'})
    .subscribe(
      (response : any) => {
        console.log("response of availableExams API : ", response);
        this.batchList = response.batchList;
        this.futureBatchList = this.batchList.filter( batch => new Date(batch.batch_start_date) > new Date());
        this.runningBatchList = this.batchList.filter( batch => new Date(batch.batch_start_date) < new Date() && new Date(batch.batch_end_date) > new Date());
        this.oldBatchList = this.batchList.filter( batch => new Date(batch.batch_end_date) < new Date());

        console.log("this.futureBatchList : ", this.futureBatchList);
        console.log("this.runningBatchList : ", this.runningBatchList);
        console.log("this.oldBatchList : ", this.oldBatchList);
      },
      (error : any) => {
        console.log(error);
      }
    );
  }

}
