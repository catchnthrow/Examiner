import { Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { Subscriber } from 'rxjs/Subscriber';

@Component({
  selector: 'app-super-nav-top-admin',
  templateUrl: './super-nav-top-admin.component.html',
  styleUrls: ['./super-nav-top-admin.component.css']
})
export class SuperNavTopAdminComponent implements OnInit {
  private user;
  constructor(private router : Router, private userDataService : UserDataService) { }

  initUser(usr){
    this.user = usr;
  }

  ngOnInit() {
    var usr = this.userDataService.getUser();
    if(usr != null && usr != undefined) {
      this.initUser(usr);
    }
  }

  goToHome(){
    this.router.navigate(["home"]);
  }

  goToProfile(){
    this.router.navigate(["profile"]);
  }

  goToLogout(){
    this.userDataService.removeUserData();
    this.router.navigate(["home"]);
  }

  goToNewQuesPaper() {
    this.router.navigate(["newquestionpaper"]);
  }

  fnTakeExam(){
    this.router.navigate(['availableexams']);
  }

  gotoMyQuestionPapers(){
    this.router.navigate(['myQuestionPapers']);
  }

  gotoExamScheduling(){
    this.router.navigate(['examScheduling']);
  }

  goToBatch(){
    this.router.navigate(['batchList']);
  }

  goToAddBatch(){
    this.router.navigate(['addBatch']);
  }
}
