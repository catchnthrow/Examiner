import { Component, OnInit } from '@angular/core';
import { ExamService } from '../services/exam.service';
import { Router } from '@angular/router';
import {HttpClient, HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
export class ScoresComponent implements OnInit {

  public score: Array<any>;
  public isErrorOnPage: boolean;
  public errorMessage: string;
  public currExam: object;
  constructor(private router : Router, private examService: ExamService, private http: HttpClient,) { }

  ngOnInit() {
    
    this.examService.exam.subscribe(e => { this.currExam = e; this.initPageElement(e); });
  }

  showDetailedResult(){    
    this.examService.updateCurrExam(this.currExam);
    this.router.navigate(['examAnalysis']);
  }

  initPageElement(exam){
    console.log(exam);
    if(exam === undefined || exam == null){
      this.isErrorOnPage = true;
      this.errorMessage = "An error occurred. Try login again.";
      return;
    }

    this.http.get("/api/getExamScore?id="+exam.id, {responseType:'json'})
    .subscribe(
      (response : any) => {
        console.log("response of getExamScore API : ", response);     
        if(response.score && response.score.length > 0){
          this.score = response.score;
        } else {
          this.isErrorOnPage = true;
          this.errorMessage = "No score found for this exam.";
        }
      },
      (error : any) => {
        console.log(error);
        this.isErrorOnPage = true;
        this.errorMessage = "An error occurred while loading the page. Try login again.";
      }
    );
  }
}
