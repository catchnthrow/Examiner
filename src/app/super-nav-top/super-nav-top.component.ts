import { Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { Subscriber } from 'rxjs/Subscriber';

@Component({
  selector: 'app-super-nav-top',
  templateUrl: './super-nav-top.component.html',
  styleUrls: ['./super-nav-top.component.css']
})
export class SuperNavTopComponent implements OnInit {
  private user;
  constructor(private router : Router, private userDataService : UserDataService) { 
  }

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

  goToRanking(){

  }

  goToLogout(){
    this.userDataService.removeUserData();
    this.router.navigate(["home"]);
  }

  fnTakeExam(){
    this.router.navigate(['availableexams']);
  }

}
