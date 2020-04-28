import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-instructions',
  templateUrl: './admin-instructions.component.html',
  styleUrls: ['./admin-instructions.component.css']
})
export class AdminInstructionsComponent implements OnInit {

  private student;
  public exam;
  private instructions: string;
  public heading : string;
  public subheading: string;
  public instructionList: Array<string>;
  public specialNotes: string;
  public isErrorOnPage: boolean;
  constructor(private router : Router, private examService: ExamService) { 
    this.instructionList = new Array<string>();
  }

  initPageElement(exam){
    console.log("exam : ", exam);
    if(exam === undefined || exam == null){
      this.isErrorOnPage = true;
      return;
    }
    this.isErrorOnPage = false;
    this.exam = exam;
    this.instructions = exam.instructions;
    var splitVals = exam.instructions.split('|');
    if(splitVals != null && splitVals != undefined && splitVals.length > 0) {
      for(var i=0; i< splitVals.length; i++) {
        if(splitVals[i].substring(0, ":head:".length) == ":head:") {
          this.heading = splitVals[i].substring(":head:".length, splitVals[i].length - (":head:".length));
          continue;
        }

        if(splitVals[i].substring(0, ":subhead:".length) == ":subhead:") {
          this.subheading = splitVals[i].substring(":subhead:".length, splitVals[i].length - (":subhead:".length));
          continue;
        }

        if(splitVals[i].substring(0, ":li:".length) == ":li:") {
          this.instructionList.push(splitVals[i].substring(":li:".length, splitVals[i].length - (":li:".length)));
          continue;
        }

        if(splitVals[i].substring(0, ":specialnotes:".length) == ":specialnotes:") {
          this.specialNotes = splitVals[i].substring(":specialnotes:".length, splitVals[i].length - (":specialnotes:".length));
          continue;
        }
      }
    }
  }
  ngOnInit() {
    this.examService.qp.subscribe(e => { this.initPageElement(e); });
  }

  startExam(){
    this.router.navigate(["previewExam"]);
  }

}
