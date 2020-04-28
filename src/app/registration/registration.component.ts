import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {HttpClient, HttpErrorResponse } from '@angular/common/http'
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public uid : string;
  public pwd : string;
  public retypepwd : string;
  public fname : string;
  public mname : string;
  public lname : string;
  public mobile : string;
  public failedRegister : boolean;
  public isGoToLogin : boolean;
  public registerResponseMessage : string;

  constructor(
    private router : Router,
    private http: HttpClient,
    private userDataService : UserDataService
  ) { }

  ngOnInit() {
    var usr = this.userDataService.getUser();
    if(usr != null && usr != undefined) {
      this.router.navigate(["home"]);
    }
    
    this.failedRegister = null;
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  register() {
    console.log("register Called");
    var u = this.uid;
    var p = this.pwd;
    var rp = this.retypepwd;
    var fname = this.fname;

    var userInfo = {
      email : this.uid,
      password : this.pwd,
      rePassword : this.retypepwd,
      first_name : this.fname,
      middle_name : this.mname,
      last_name : this.lname,
      mobile : this.mobile
    }
    this.failedRegister = null;
    this.http.post("/api/register", {userInfo}, {responseType:'json'})
    .subscribe(
      (response : any) => {
        console.log("inside subscribe");
        console.log("response12 : ", response);
        this.registerResponseMessage = response.message;
        if(response.message == 'User Exists') {
          this.failedRegister = false;
        }
        if(response.message == "Registration Successful") {
          this.failedRegister = false;
          this.isGoToLogin = true;
        } else {
          this.failedRegister = true;
          this.isGoToLogin = false;
        }
      },
      (error: any) => {
        console.log("error : ",error);
        this.registerResponseMessage = error.message;
        this.failedRegister = true;
        this.isGoToLogin = false;
      }
    );

  }

}
