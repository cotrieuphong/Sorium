import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import * as $ from 'jquery';
import { UserService } from '../_services/user.service'
import { AuthenticationService } from '../_services/authentication.service';
import {MatMenuTrigger} from '@angular/material';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  tokenKey;
  isLoggedin = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService) {
    this.tokenKey = localStorage.getItem('tokenKey');
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, false)

    if(this.tokenKey){
      this.isLoggedin = true;
    }

    $(function(){
      $('.menu-btn').click(function(){

      })
    })

  }

  signout() {
    this.isLoggedin = false;
    this.authenticationService.logout();
  }

  scroll = (): void => { this.trigger.closeMenu() };

}
