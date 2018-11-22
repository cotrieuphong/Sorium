import { Component, ViewEncapsulation, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { DataService } from '../data.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from "@angular/router";
import { first } from 'rxjs/operators';

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
  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private nz: NzNotificationService,
    private router: Router,
    private authenticationService: AuthenticationService) {}

  ngOnInit(){
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
    this.authenticationService.login(self.signinForm.value).pipe(first()).subscribe(data => {
      self.isLoading = false;
      self.nz.create('success', 'Thành công', 'Đăng nhập thành công', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      })
      setTimeout(function() {
        // localStorage.setItem('currentUser', JSON.stringify(data));
				localStorage.setItem('tokenKey', data.Data.AccessToken)
				self.router.navigate(['/'])
			}, 1000)
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
