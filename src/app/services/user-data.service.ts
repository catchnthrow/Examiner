import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse } from '@angular/common/http'
import {Observable} from "rxjs/Observable";
import { Router } from '@angular/router';

export class user{
}

@Injectable()
export class UserDataService {

  constructor(private http: HttpClient, private router : Router) { }

  saveUser(userData){
    if(userData && userData.user && userData.token && userData.token.length > 0){
      localStorage.setItem('user', JSON.stringify(userData.user));
      localStorage.setItem('token', userData.token);
    }
  }

  getUser(){
    var usr = localStorage.getItem('user');
    if(usr != null){      
      return  JSON.parse(usr);
    } else {
      this.router.navigate["login"];
    }
  }
  
  removeUserData(){
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
  // getUserDataFromServer() : Observable<user> {
  //   return this.http.get("/api/getUserFromCookie", {responseType:'json'});
  // }  
}
