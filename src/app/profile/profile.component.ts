import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

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
    //this.userDataService.user.subscribe(t => this.initUser(t));
    // this.user = this.userDataService.fnUser();
    // this.initUser(this.user);
    //this.userDataService.user.subscribe(m => this.initUser(m));
    // console.log("ProfileComponent ngOnInit called 1");
    // this.user = this.userDataService.getUser();
    // console.log("ProfileComponent ngOnInit called 2");
    
    // if(this.user) {
    //   this.isDataAvailable = true;
    //   console.log("this.user is available");
    // }
    // else {
    //   this.isDataAvailable = false;
    //   console.log("this.user not available");
    // }
    // if(this.user == undefined || this.user == null){
    //   console.log("userDataService does not have user data.");
    //   this.userDataService.getUserDataFromServer()
    //   .subscribe(data => this.initUser(data), err => console.log(err));
    // }
    // else{
      
    //   this.isDataAvailable = true;
    // }
    // console.log("isDataAvailable : ", this.isDataAvailable);
  }

}
