import { Component, OnInit } from '@angular/core';
import { RoutingModule } from '../routing.module';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private user;
  constructor(private userDataService : UserDataService) { }

  initUser(usr){
    this.user = usr;
  }

  ngOnInit() {
    var usr = this.userDataService.getUser();
    if(usr != null && usr != undefined) {
      this.initUser(usr);
    }
  }

}
