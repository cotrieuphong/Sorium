import { Component, ViewEncapsulation, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { DataService } from '../data.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from "@angular/router";
import { first } from 'rxjs/operators';
import { UserService } from '../_services/user.service';
import { AuthenticationService } from '../_services/authentication.service'

@Component({

  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SigninComponent implements OnInit {

  signinForm : FormGroup;
  hide = true;
  isLoading = false;
  resend = false;
  id;
  resendOTP;
  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private nz: NzNotificationService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService) {}

  ngOnInit(){
    localStorage.removeItem('tokenKey');
    sessionStorage.removeItem('Id');
    this.authenticationService.logout();
    this.signinForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+)$'),
        Validators.minLength(6)
      ]]
    });
  }

  get email() {
    return this.signinForm.get('email')
  }

  get password() {
    return this.signinForm.get('password')
  }

  signin() {
    this.isLoading = true;
    const self = this;
    if (self.signinForm.invalid) {
      this.isLoading = false;
      return;
    }
    this.authenticationService.login(self.signinForm.value).subscribe(data => {
      self.isLoading = false;
      sessionStorage.setItem('Id', data.Data.Id);
      if(data.Data.EmailConfirmed == 1){
        self.nz.create('success', 'Thành công', 'Đăng nhập thành công', {
          nzDuration: 2500,
          nzAnimate: true,
          nzPauseOnHover: true
        });
        localStorage.setItem('tokenKey', data.Data.AccessToken);
        setTimeout(function() {
          self.router.navigate(['/'])
        }, 1000)
      }else{
        this.id = sessionStorage.getItem('Id');
        this.resendOTP = {
          Id: this.id,
          SucRedirectUrl: window.location.origin + '%23/dang-nhap',
          FailRedirectUrl: window.location.origin + '%23/dang-ky'
        }
        self.resend = true;
        self.nz.create('error', 'Lỗi', 'Chưa xác nhận email', {
          nzDuration: 2500,
          nzAnimate: true,
          nzPauseOnHover: true
        });
      }
    },
    error => {
      self.isLoading = false;
      self.nz.create('error', 'Lỗi', 'Sai thông tin đăng nhập', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      });
    }
  )
  }

  resendConfirm(){
    console.log("resend");
    this.userService.resendOtp(this.resendOTP).subscribe(res => {

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


  // signin() {
  //   const self = this;
  //   self.isLoading = true;
  //   if(self.signinForm.status == 'VALID'){
  //     self.data.signinService(self.signinForm.value).subscribe(res => {
  //       self.isLoading = false;
  //       self.nz.create('success', 'Thành công', 'Đăng nhập thành công', {
  //         nzDuration: 4500,
  //         nzAnimate: true,
  //         nzPauseOnHover: true
  //       })
  //       setTimeout(function() {
	// 				// localStorage.getItem('tokenKey', res.Data.AccessToken)
	// 				self.router.navigate(['/'])
	// 			}, 1000)
  //     },
  //     errror => {
  //       self.isLoading = false;
  //       self.nz.create('error', 'Lỗi', 'Sai thông tin đăng nhập', {
  //         nzDuration: 2500,
  //         nzAnimate: true,
  //         nzPauseOnHover: true
  //       });
  //     }
  //   )
  //   }
  //   else{
  //     return;
  //   }
  // }
}
