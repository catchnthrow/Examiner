import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {HttpClient, HttpErrorResponse } from '@angular/common/http'
import { UserDataService } from '../services/user-data.service';
import { delay }      from 'rxjs/operator/delay';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../Interceptor/token.interceptor';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private user;
  private loginData : string;

  public uid : string;
  public pwd : string;
  public failedLogin : boolean;

  constructor(
    private router : Router,
    private http: HttpClient,
    private userDataService : UserDataService
  ) {
  }

  ngHandleLoggedInUser(userData) {
    if(userData && userData.user && userData.token && userData.token.length > 0){
      this.router.navigate(['profile']);
      this.failedLogin = false;
    } else {
      this.router.navigate(['home']);
    }
  }

  ngOnInit() {
    var usr = this.userDataService.getUser();
    if(usr != null && usr != undefined) {
      this.router.navigate(["home"]);
    }
    //console.log("ngHandleLoggedInUser ngOnInit called");
    //this.userDataService.user.subscribe(m => this.ngHandleLoggedInUser(m));
  }

  login() {
    console.log("Login Called");
    
    if(this.uid == undefined || this.pwd == undefined || this.uid.length < 4 || this.pwd.length < 4){
      this.failedLogin = true;
      return;
    }
    
    var u = this.uid;
    var p = this.pwd;
    this.failedLogin = false;
    this.http.post("/login", {u,p}, {responseType:'json'})
    .subscribe(
      (response : any) => {
        //console.log(response);
        if(response.message == "Success")
        {
          //console.log("l1");
          this.userDataService.saveUser(response);
          this.ngHandleLoggedInUser(response);
        } else {
          //console.log("l2");
          this.failedLogin = true;
        }
      },
      (error: any) => {
        console.log(error);
        this.failedLogin = true;
      }
    );    
  }
}
