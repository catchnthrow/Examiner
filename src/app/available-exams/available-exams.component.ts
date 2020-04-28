import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserDataService } from '../services/user-data.service';
import { ExamService } from '../services/exam.service';

@Component({
  selector: 'app-available-exams',
  templateUrl: './available-exams.component.html',
  styleUrls: ['./available-exams.component.css']
})
export class AvailableExamsComponent implements OnInit {

  public submitError = false;
  public submitted = false;
  public currExam: object;
  public errorOnPage: string;
  public examsList: Array<any>;
  public notRegisteredExams: Array<any>;
  public registeredAndOngoingExams: Array<any>;
  public completedExams: Array<any>;
  
  constructor(
    private router : Router,
    private http: HttpClient,
    private userDataService : UserDataService,
    private examService : ExamService
  ) { }

  ngOnInit() {

    console.log("Login Called");
    this.http.get("/api/availableExams", {responseType:'json'})
    .subscribe(
      (response : any) => {
        console.log("response of availableExams API : ", response);
        this.examsList = response.examsList.sort(function(a,b){return a - b;});
        this.notRegisteredExams = this.examsList.filter(exam => exam.status_name == "Not Registered");
        this.registeredAndOngoingExams = this.examsList.filter(exam => exam.status_name == "Registered" || exam.status_name == "Ongoing");
        this.completedExams = this.examsList.filter(exam => exam.status_name == "Completed");

        console.log("this.notRegisteredExams : ", this.notRegisteredExams);
        console.log("this.registeredAndOngoingExams : ", this.registeredAndOngoingExams);
        console.log("this.completedExams : ", this.completedExams);
      },
      (error : any) => {
        console.log(error);
        this.errorOnPage = error;
      }
    );
  }

  onSelect(exam) {
    console.log("onSelect called(). exam : ", exam);
    this.currExam = exam;
    this.examService.updateCurrExam(exam);
    this.router.navigate(['instructions']);
  }

  register(exam){
    console.log("register called(). exam : ", exam);
    this.http.post("/api/registerExam", {exam : exam})
    .subscribe(
      (response : any) => {
        console.log(response);
        if(response.message == "Success"){
          console.log("response of registerExam API : ", response);
          this.submitted = true;
          this.submitError = false;

          setTimeout(() => this.submitted = false, 10000);

          this.examsList.forEach(ex => {
            if(ex.id == exam.id){
              exam.status_name = "Registered";
            }
          });
          this.notRegisteredExams = this.examsList.filter(exam => exam.status_name == "Not Registered");
          this.registeredAndOngoingExams = this.examsList.filter(exam => exam.status_name == "Registered" || exam.status_name == "Ongoing");
          this.completedExams = this.examsList.filter(exam => exam.status_name == "Completed");

          console.log("this.notRegisteredExams : ", this.notRegisteredExams);
          console.log("this.registeredAndOngoingExams : ", this.registeredAndOngoingExams);
          console.log("this.completedExams : ", this.completedExams);
        } else {
          this.submitted = true;
          this.submitError = true;
          setTimeout(() => this.submitted = false, this.submitError = false, 10000);
        }

      },
      (error : any) => {
        console.log(error);
        this.submitted = true;
        this.submitError = true;
        setTimeout(() => this.submitted = false, this.submitError = false, 10000);
      }
    );
  }

  showScore(exam){
    this.currExam = exam;
    this.examService.updateCurrExam(exam);
    this.router.navigate(['scores']);
  }

}
