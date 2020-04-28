import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TimerService {

  private timer = new BehaviorSubject<any>(null);
  timeLeft = this.timer.asObservable();
  constructor() { 
    this.startTimer();
  }


  timeLeft1: number = 60;
  interval;

  startTimer() {
    console.log("startTimer called");
    this.interval = setInterval(() => {
      if(this.timeLeft1 > 0) {
        this.timeLeft1--;
        this.timer.next(this.timeLeft1);
      } else {
        this.timeLeft1 = 60;
      }
    },1000);
  }
}
