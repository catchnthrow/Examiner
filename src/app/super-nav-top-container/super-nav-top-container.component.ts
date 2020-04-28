import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
@Component({
  selector: 'app-super-nav-top-container',
  templateUrl: './super-nav-top-container.component.html',
  styleUrls: ['./super-nav-top-container.component.css']
})
export class SuperNavTopContainerComponent implements OnInit {
  private user;
  constructor(private userDataService : UserDataService) { }

  initUser(usr){
    this.user = usr;
    console.log("usr  : ", usr);
  }

  ngOnInit() {
    var usr = this.userDataService.getUser();
    if(usr != null && usr != undefined) {
      this.initUser(usr);
    }
  }

}
