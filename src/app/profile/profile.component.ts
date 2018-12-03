import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { UserService } from '../_services/user.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import * as $ from 'jquery';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit{
  tokenKey;
  userInfo = [];
  constructor(
    private userService: UserService,
    private nz: NzNotificationService,
    private router: Router) {
      this.tokenKey = localStorage.getItem('tokenKey');
      if(this.tokenKey){
        this.userService.getUser(this.tokenKey).subscribe((res:any) => {
          if(!res.Data.UserAvatar){
            res.Data.UserAvatar = './../../assets/img/user.png'
          }
          this.userInfo = res.Data;
          console.log(res);
        },
        error => {
          this.router.navigate(['/dang-nhap'])
          this.tokenKey = localStorage.getItem('tokenKey');
        });

      }
  }

  ngOnInit() {
  }


}
