import { Component, ViewEncapsulation, OnInit} from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { UserService } from '../../_services/user.service';
@Component({
  selector: 'app-signup-confirm',
  templateUrl: './signup-confirm.component.html',
  styleUrls: ['./signup-confirm.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignupConfirmComponent implements OnInit {

  id;
  resendOTP;
  isDisable = false;
  constructor(
    private userService: UserService,
    private nz: NzNotificationService) { }

  ngOnInit() {
    this.id = sessionStorage.getItem('Id');
    this.resendOTP = {
      Id: this.id,
      SucRedirectUrl: window.location.origin + '%23/dang-nhap',
      FailRedirectUrl: window.location.origin + '%23/dang-ky'
    }
    console.log(this.resendOTP);
  }


  resend() {
    this.userService.resendOtp(this.resendOTP).subscribe(res => {
      this.isDisable = true;
      this.nz.create('success', 'Thành công', 'Vui lòng check email của bạn', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      });
    },
    error => {
      console.log(error);
      this.nz.create('error', 'Lỗi', 'Gửi email không thành công', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      });
    }
  )
  }

}
