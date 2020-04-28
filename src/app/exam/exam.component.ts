import { Component, OnInit } from '@angular/core';
//import { UserDataService } from '../services/user-data.service';
import { ExamService } from '../services/exam.service';
// import { TimerService } from '../services/timer.service';
import {HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as _ from 'underscore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {

  private student;
  public exam;
  public questionPaper;
  public answeredQuestions = new Array();
  private flag = 0;
  public currQuestion = null;
  public usersAnswersFromServer = new Array();
  public usersAnswers = new Array();
  public currCategory;
  public timeLeft;
  public timer = {hh:0,mm:0,ss:0};

  constructor(
    private examService: ExamService,
    // private timerService: TimerService,
    private http: HttpClient,
    private router : Router
  ) {
      this.flag = 0;
   }

  ngOnInit() {
    this.examService.exam.subscribe(e => {
      this.exam = e;
      if(this.flag == 0) {
        this.flag = 1;
        this.loadPageElements();
      }
    });
  }

  startTimer(timeLeft){
    var timeToServerTick = 0;
    setInterval(() => {
      if(timeLeft > 0) {
        this.timer.hh = Math.floor(timeLeft/3600);
        this.timer.mm = Math.floor((timeLeft%3600)/60);
        this.timer.ss = ((timeLeft%3600)%60);
        if(timeToServerTick == 10){
          timeToServerTick = 0;
          this.http.post('/api/updateTimer',{timeLeft : timeLeft, examId : this.exam.id})
          .subscribe(
            (response : any) => {
              console.log(response);
            },
            (error: any) => {
              console.log("error in updateTimer : ", error);
              return null;
            }

          )
        }
        timeLeft--;
        timeToServerTick++;
      } else {        
        this.http.post('/api/updateTimer',{timeLeft : 0, examId : this.exam.id})
          .subscribe(
            (response : any) => {
              console.log(response);
              this.endExam();
            },
            (error: any) => {
              console.log("error in updateTimer : ", error);
              this.endExam();
            }
          );
      }
    },1000);
  }

  loadPageElements() {
    this.http.get("/api/startExam?id=" + this.exam.id)
    .subscribe(
      (response : any) => {
        console.log("response: ", response);

        this.questionPaper = response.questionPaper;

        this.startTimer(this.questionPaper.totalTime);

        var a = JSON.parse(JSON.stringify(response.questionPaper.usersAnswers));
        if(a != null && a != undefined){
          this.usersAnswersFromServer = a;
        }



        this.questionPaper.categories.forEach(cat => {
          //create to lists for un/answered questions
          cat.answeredQuestions = new Array();
          cat.unansweredQuestions = new Array();

          //now segregate all questions into above lists + assigned other attributes as well. 
          cat.questions.forEach(question => {
            question = this.assignAnswerSheetAttrToQuestion(question, question.id);
            
            //segregate all questions into above lists
            if(question.isAnswered == true){
              cat.answeredQuestions.push(question);
            } else {
              cat.unansweredQuestions.push(question);
            }
          });
        });

        this.refreshCategoryReviewQuestion();

        if(this.usersAnswersFromServer != null && this.usersAnswersFromServer.length > 0) {
          this.openQuestion(this.usersAnswersFromServer[this.usersAnswersFromServer.length -1].questionId);
        } else {
          this.openQuestion(this.questionPaper.categories[0].unansweredQuestions[0].id);
        }
      },
      (error: any) => {
        console.log("error in startExam : ", error);
        return null;
      }
    );
  }

  clearSelection() {
    this.currQuestion.answers.forEach(answer => {
      answer.isSelected = false;
    });
  }

  markForReview() {
    this.currQuestion.isMarkedForReview = true;
    this.refreshCategoryReviewQuestion();
  }

  unMarkReview() {
    this.currQuestion.isMarkedForReview = false;
    this.refreshCategoryReviewQuestion();
  }

  selectOneAnswer(answerId) {
    this.currQuestion.answers.forEach(answer => {
      if(answer.id == answerId){
        answer.isSelected = true;
      } else {
        answer.isSelected = false;
      }
    });
  }
  //TODO
  selectMultipleAnswer(answerId) {
    console.log('selectMultipleAnswer not implemented.');
  }

  openQuestion(questionId){
    this.currQuestion = this.getQuestionById(questionId);

    //if this question was already answered then load its answered value on ui
    this.currQuestion = this.assignAnswerSheetAttrToQuestion(this.currQuestion, questionId);

    //update the current category here
    this.questionPaper.categories.forEach(cat => {
      cat.isCurrentCategory = false;
      cat.unansweredQuestions.forEach(q => {
        if(q.id == questionId){
          cat.isCurrentCategory = true;
          return;
        }
      });
      cat.answeredQuestions.forEach(q => {
        if(q.id == questionId){
          cat.isCurrentCategory = true;
          return;
        }
      });
    });
  }

  private assignAnswerSheetAttrToQuestion(question, questionId) {
    var temp = _.find(this.usersAnswersFromServer, function (q) { return q.questionId == questionId; });
    if (temp != undefined) {
      question.isMarkedForReview = temp.isMarkedForReview;
      question.isIssueReported = temp.isIssueReported;
      question.subjectiveAnswer = temp.subjectiveAnswer;
      question.answers.forEach(answer => {
        if (answer.id == temp.answerId) {
          answer.isSelected = true;
        }
        else {
          answer.isSelected = false;
        }
      });

      question.isAnswered = question.answers.filter(answer => answer.isSelected == true).length > 0;
    }

    return question;
  }

  submitAndNext(){

    this.submit(true);
  }

  submitAndPrevious(){
    this.submit(false);
  }

  reportIssue() {
    this.currQuestion.isIssueReported = true;
  }

  unReportIssue(){
    this.currQuestion.isIssueReported = false;
  }

  endExam(){
    this.http.post("/api/endExam", {questionPaper : {id: this.questionPaper.id}})
    .subscribe(
      (response : any) => {
        console.log("response: ", response);
        if(response != undefined && response.message != undefined){
          if(response.message == 'Error'){
            // ToDo show some error message on screen
          } else {
            //go to home page.
            this.router.navigate(["home"]);
          }
        } else {
          // ToDo show some error message on screen
        }
      },
      (error: any) => {
        console.log("error in startExam : ",error);
      }
    );
  }

  getUserAnswerToBeUpdated(){
    var ansId = this.currQuestion.answers.find(function(a){return a.isSelected == true;});
    var retVal = {
      questionId : this.currQuestion.id == undefined ? null : this.currQuestion.id,
      answerId : ansId == undefined ? null : ansId.id,
      isMarkedForReview : this.currQuestion.isMarkedForReview == undefined ? null : this.currQuestion.isMarkedForReview,
      isIssueReported : this.currQuestion.isIssueReported == undefined ? null : this.currQuestion.isIssueReported,
      subjectiveAnswer : this.currQuestion.subjectiveAnswer == undefined ? null : this.currQuestion.subjectiveAnswer
    }

    return retVal;
  }

  submit(isNext) {

    var selectedAns = this.getUserAnswerToBeUpdated();   
    
    //if question was answered for the first time
    if(this.isQuestionAnsweredForFirstTime(selectedAns)){
      // Save to server.
      this.http.post("/api/saveAnswer", {userAnswer : selectedAns})
      .subscribe(
        (response : any) => {
          console.log("response: ", response);
          if(response != undefined && response.message != undefined){
            if(response.message == 'Error'){
              // ToDo show some error message on screen
            } else {
              //Add the new answer to usersAnswers
              this.usersAnswersFromServer.push(selectedAns);
              this.updateQuestions(selectedAns);
              //check if this was the last answer
              if(isNext == null) {
                this.endExam();
              }
              var nextQuestionSNo = isNext ? this.currQuestion.sno + 1 : this.currQuestion.sno - 1;
              this.openQuestion(this.getQuestionBySno(nextQuestionSNo).id);
            }
          } else {
            // ToDo show some error message on screen
          }
        },
        (error: any) => {
          console.log("error in startExam : ",error);
        }
      );
    }
    else {
      this.http.post("/api/updateAnswer", {userAnswer : selectedAns})
        .subscribe(
          (response : any) => {
            console.log("response: ", response);
            if(response != undefined && response.message != undefined){
              if(response.message == 'Error'){
                // ToDo show some error message on screen
              } else {
                //Add the new answer to usersAnswers
                this.updateAnswersFromServer(selectedAns);
                this.updateQuestions(selectedAns);
                //check if this was the last answer
                if(isNext == null) {
                  this.endExam();
                }
                var nextQuestionSNo = isNext ? this.currQuestion.sno + 1 : this.currQuestion.sno - 1;
                this.openQuestion(this.getQuestionBySno(nextQuestionSNo).id);
              }
            } else {
              // ToDo show some error message on screen
            }
          },
          (error: any) => {
            console.log("error in startExam : ",error);
          }
        );
    }
  }

  private updateQuestions(selectedAns){
    //if now answer is selected -> move to unanswered list
    if(selectedAns.answerId == null || selectedAns.answerId == undefined) {
      this.questionPaper.categories.forEach(cat => {
        var t = cat.answeredQuestions.filter(q => q.id == selectedAns.questionId)[0];
        if(t != undefined) {
          cat.unansweredQuestions.push(t);
          cat.answeredQuestions = _.sortBy(cat.answeredQuestions.filter(q => q.id != selectedAns.questionId), 'sno');
          cat.unansweredQuestions = _.sortBy(cat.unansweredQuestions, 'sno');
          return;
        }
      });
    } 
    //else move to answered list
    else {
      this.questionPaper.categories.forEach(cat => {
        var t = cat.unansweredQuestions.filter(q => q.id == selectedAns.questionId)[0];
        if(t != undefined) {
          cat.answeredQuestions.push(t);
          cat.unansweredQuestions = _.sortBy(cat.unansweredQuestions.filter(q => q.id != selectedAns.questionId), 'sno');
          cat.answeredQuestions = _.sortBy(cat.answeredQuestions, 'sno');
          return;
        }
      });
    }
  }

  private refreshCategoryReviewQuestion() {
    this.questionPaper.categories.forEach(category => {
      if(category.answeredQuestions.filter(function(x){return x.isMarkedForReview == true;}).length > 0){
        category.isAnyQuestionForReview = true;
      } else {
        category.isAnyQuestionForReview = false;
      }

      if(category.unansweredQuestions.filter(function(x){return x.isMarkedForReview == true;}).length > 0){
        category.isAnyQuestionForReview = true;
      } else {
        category.isAnyQuestionForReview = false;
      }
    });
  }

  private getQuestionBySno(sno){
    var cat = this.questionPaper.categories.find(c => c.unansweredQuestions.find(q => q.sno == sno));
    if(cat != undefined){
      return cat.unansweredQuestions.find(qq => qq.sno == sno);
    }
    cat = this.questionPaper.categories.find(c => c.answeredQuestions.find(q => q.sno == sno));
    if(cat != undefined){
      return cat.answeredQuestions.find(qq => qq.sno == sno);
    } else {
      return null;
    }
  }

  private getQuestionById(questinoId){
    var cat = this.questionPaper.categories.find(c => c.unansweredQuestions.find(q => q.id == questinoId));
    if(cat != undefined){
      return cat.unansweredQuestions.find(qq => qq.id == questinoId);
    }
    cat = this.questionPaper.categories.find(c => c.answeredQuestions.find(q => q.id == questinoId));
    if(cat != undefined){
      return cat.answeredQuestions.find(qq => qq.id == questinoId);
    } else {
      return null;
    }
    
    // var question = this.questionPaper.categories
    //                 .find(c => c.questions.find(q => q.id == questinoId))
    //                 .questions.find(qq => qq.id == questinoId);
    // return question;
  }

  private isQuestionAnsweredForFirstTime(userAnswer){
    var t = _.find(this.usersAnswersFromServer, function(x){return x.questionId == userAnswer.questionId});
    return t == undefined;
  }

  private isAnswerChanged(userAnswers){
    return _.find(this.usersAnswersFromServer, function(x){return x.questionId == userAnswers.questionId && x.answerId != userAnswers.answerId}) != undefined;
  }

  private updateAnswersFromServer(userAnswer){
    this.usersAnswersFromServer.forEach(ans => {
      if(ans.questionId == userAnswer.questionId) {
        ans.answerId = userAnswer.answerId;
        ans.isMarkedForReview = userAnswer.isMarkedForReview;
        ans.isIssueReported = userAnswer.isIssueReported;
        ans.subjectiveAnswer = userAnswer.subjectiveAnswer;
      }
    });
  }

  private deleteAnswersFromServer(previousAnswerId){
    this.usersAnswersFromServer = _.filter(this.usersAnswersFromServer, function(s){return s.answerId != previousAnswerId});
  }

}
