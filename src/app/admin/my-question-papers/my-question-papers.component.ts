import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserDataService } from '../../services/user-data.service';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-my-question-papers',
  templateUrl: './my-question-papers.component.html',
  styleUrls: ['./my-question-papers.component.css']
})
export class MyQuestionPapersComponent implements OnInit {

  public currQP: object;
  public errorOnPage: string;
  public qpList: Array<object>;
  constructor(
    private router : Router,
    private http: HttpClient,
    private userDataService : UserDataService,
    private examService : ExamService
  ) { }

  ngOnInit() {
    console.log("Login Called");
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

  onSelect(qp) {
    console.log("onSelect called(). exam : ", qp);
    this.currQP = qp;
    this.examService.updateCurrQP(qp);
    this.router.navigate(['adminInstructions']);
  }

}
