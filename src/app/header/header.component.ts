import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import * as $ from 'jquery';
import { UserService } from '../_services/user.service'
import { AuthenticationService } from '../_services/authentication.service';
import { NzNotificationService } from 'ng-zorro-antd';
import {MatMenuTrigger} from '@angular/material';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  tokenKey: String;
  isLoggedin = false;
  userInfo:any = [];
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private nz: NzNotificationService) {
    this.tokenKey = localStorage.getItem('tokenKey');
    if(this.tokenKey){
      this.userService.getUser(this.tokenKey).subscribe((res:any)=>{
        if (!res.Succeeded){
          localStorage.removeItem('tokenKey');
        } else {
            if(!res.Data.UserAvatar){
              res.Data.UserAvatar = './../../assets/img/user.png'
            }
            this.userInfo = res.Data;
            this.isLoggedin = true;
        }
      });
    }
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, false)

  }

  signout() {
    this.isLoggedin = false;
    this.authenticationService.logout();
  }

  scroll = (): void => { this.trigger.closeMenu() };

}
