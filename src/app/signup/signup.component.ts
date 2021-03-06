import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { DataService } from '../data.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from "@angular/router";
import { first } from 'rxjs/operators';
import { UserService } from '../_services/user.service'
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SignupComponent implements OnInit {

  signupForm : FormGroup;
  hide = true;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private nz: NzNotificationService,
    private router: Router,
    private userService: UserService) {}

  ngOnInit(){
    sessionStorage.removeItem('Id');
    localStorage.removeItem('tokenKey');
    this.signupForm = this.fb.group({
      FirstName: ['', [
        Validators.required,
        Validators.maxLength(30)
      ]],
      LastName: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      Email: ['', [
        Validators.required,
        Validators.email
      ]],
      Password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+)$'),
        Validators.minLength(6)
      ]],
      SucRedirectUrl: window.location.origin + '%23/dang-nhap',
      FailRedirectUrl: window.location.origin + '%23/dang-ky'
    });


  }

  get FirstName() {
    return this.signupForm.get('FirstName')
  }

  get LastName() {
    return this.signupForm.get('LastName')
  }
  get Email() {
    return this.signupForm.get('Email')
  }
  get Password() {
    return this.signupForm.get('Password')
  }

  signup() {
    this.isLoading = true;
    const self = this;
    if (self.signupForm.invalid) {
      this.isLoading = false;
      return;
    }
    this.userService.signup(self.signupForm.value).pipe(first()).subscribe((data: any) => {
      self.isLoading = false;
      self.nz.create('success', 'Thành công', 'Đăng ký thành công', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      });
      sessionStorage.setItem('Id', data.Data.Id);
      setTimeout(function() {
        self.router.navigate(['/xac-nhan'])
      }, 1000)
    },
    error => {
      console.log(error.error.Errors);
      if(error.error.Errors[0].Code == 2){
        self.isLoading = false;
        self.nz.create('error', 'Lỗi', 'Email đã tồn tại', {
          nzDuration: 2500,
          nzAnimate: true,
          nzPauseOnHover: true
        });
      }else{
        self.isLoading = false;
        self.nz.create('error', 'Lỗi', 'Sai thông tin đăng ký', {
          nzDuration: 2500,
          nzAnimate: true,
          nzPauseOnHover: true
        });
      }
    }
  )
  }



  // signup() {
  //   const self = this;
  //   self.isLoading = true;
  //   if(self.signupForm.status == 'VALID'){
  //     self.data.signupService(self.signupForm.value).pipe(first()).subscribe(res => {
  //       self.isLoading = false;
  //       self.nz.create('success', 'Thành công', 'Đăng ký thành công', {
  //         nzDuration: 4500,
  //         nzAnimate: true,
  //         nzPauseOnHover: true
  //       })
  //       setTimeout(function() {
	// 				localStorage.setItem('tokenKey', res.Data.AccessToken)
	// 				self.router.navigate(['/dang-nhap'])
	// 			}, 2000)
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
