import { Component, OnInit } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-new-question-paper',
  templateUrl: './new-question-paper.component.html',
  styleUrls: ['./new-question-paper.component.css']
})
export class NewQuestionPaperComponent implements OnInit {

  constructor(private http: HttpClient, private router : Router) { }
  fileToUpload: File = null;
  public questionPaper = {
   title:'',
   courseName:'',
   duration:0,
   instruction:{
     heading:'',
     subheading:'',
     specialNotes:'',
     instructions:['']
   }
  };
  public submitError = false;
  public submitted = false;
  ngOnInit() {
  }

  addInstruction(){
    this.questionPaper.instruction.instructions.push("");
    console.log('add instruction called', this.questionPaper);
  }

  removeInstruction(index){
    this.questionPaper.instruction.instructions.splice(index, 1);
    if(this.questionPaper.instruction.instructions.length == 0){
      this.questionPaper.instruction.instructions.push("");
    }
    console.log('remove instruction called', this.questionPaper);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log("handleFileInput called.", this.fileToUpload);
  }

  submit(){
    this.submitted = true;
    var fd = new FormData();
    fd.append('file', this.fileToUpload);
    fd.append('questionPaper', JSON.stringify(this.questionPaper));
    this.http.post("/admin/addNewQuestionPaper", fd)
    .subscribe(
      (response : any) => {
        console.log("response: ", response);
        this.submitError = false;
      },
      (error: any) => {
        console.log("error in submit question paper : ", error);
        this.submitError = true;
      });
  }

  downloadTemplate(){
    document.location.href = '/admin/download/QuestionPaperTemplate.xlsx';
  }

  showQuestionPapers(){
    this.router.navigate(['myQuestionPapers']);
  }

  customTrackBy(index: number, obj: any): any {
    return  index;
  }
}
