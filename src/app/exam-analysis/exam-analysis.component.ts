import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { ExamService } from '../services/exam.service';
import {HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as _ from 'underscore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam-analysis',
  templateUrl: './exam-analysis.component.html',
  styleUrls: ['./exam-analysis.component.css']
})
export class ExamAnalysisComponent implements OnInit {

  private student;
  public exam;
  public questionPaper;
  public answeredQuestions = new Array();
  private flag = 0;
  public currQuestion = null;
  public usersAnswersFromServer = new Array();
  public usersAnswers = new Array();
  public currCategory;
  constructor(
    private examService: ExamService,
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

  loadPageElements() {
    this.http.get("/api/getExamAnalysis?id=" + this.exam.id)
    .subscribe(
      (response : any) => {
        console.log("response: ", response);

        this.questionPaper = response.questionPaper;

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
    var correctAnswerIdsArr = [];
    question.correctAnsIds.split(',').map(function(item){
      if(item.trim()!=''){
        var parse = parseInt(item.trim());
        if(!isNaN(parse)) {
          correctAnswerIdsArr.push(parse);
        }
      }
  });
    question.isUserResponseCorrect = true;
    if (temp != undefined) {
      question.isMarkedForReview = temp.isMarkedForReview;
      question.isIssueReported = temp.isIssueReported;
      question.subjectiveAnswer = temp.subjectiveAnswer;
      question.answers.forEach(answer => {
        answer.isAnswer = correctAnswerIdsArr.indexOf(answer.id) >= 0 ? true : false;
        if (answer.id == temp.answerId) {
          answer.isSelected = true;
          question.isUserResponseCorrect = question.isUserResponseCorrect && answer.isAnswer;
        }
        else {
          answer.isSelected = false;
          question.isUserResponseCorrect = question.isUserResponseCorrect && !answer.isAnswer;
        }
      });

      //logic to display the status ribbon in RED - Wrong/GREEN - Right/BLACK -  Not Answered
      
      
      question.isAnswered = question.answers.filter(answer => answer.isSelected == true).length > 0;
      question.isUserResponseCorrect = !question.isAnswered ? "NotAnswered" : question.isUserResponseCorrect === true ? "Correct" : "Wrong";
    } else {
      question.isUserResponseCorrect = "NotAnswered";
    }
    return question;
  }

  submitAndNext(){

    this.submit(true);
  }

  submitAndPrevious(){
    this.submit(false);
  }
  submit(isNext) {
    var nextQuestionSNo = isNext ? this.currQuestion.sno + 1 : this.currQuestion.sno - 1;
    this.openQuestion(this.getQuestionBySno(nextQuestionSNo).id);    
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
}
