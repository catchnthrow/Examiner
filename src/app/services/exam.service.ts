import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ExamService {

  private currExam = new BehaviorSubject<any>(null);
  private currQP = new BehaviorSubject<any>(null);
  exam = this.currExam.asObservable();
  qp = this.currQP.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  updateCurrExam(exam){
    this.currExam.next(exam);
  }

  updateCurrQP(qp){
    this.currQP.next(qp);
  }
}
