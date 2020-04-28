import { Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-super-nav-top-guest',
  templateUrl: './super-nav-top-guest.component.html',
  styleUrls: ['./super-nav-top-guest.component.css']
})
export class SuperNavTopGuestComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {
  }
  
  goToHome(){
    this.router.navigate(["home"]);
  }

  goToRegister(){
    this.router.navigate(["register"]);
  }

  goToLogin(){
    this.router.navigate(["login"]);
  }

}
