import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import * as $ from 'jquery';
import { User } from '../_models/user';
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
  currentUser: User;
  isLoggedin = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, false)

    if(this.currentUser){
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
