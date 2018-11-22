import { Component, ViewEncapsulation, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from "@angular/router";
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../_services/authentication.service'
@Component({
  selector: 'app-forgot-pw',
  templateUrl: './forgot-pw.component.html',
  styleUrls: ['./forgot-pw.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPwComponent implements OnInit {

  pwForm : FormGroup;
  hide = true;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private nz: NzNotificationService,
    private router: Router,
    private authenticationService: AuthenticationService) {}

  ngOnInit(){
    this.pwForm = this.fb.group({
      Email: ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  get Email() {
    return this.pwForm.get('Email')
  }

  signin() {
    this.isLoading = true;
    const self = this;
    if (self.pwForm.invalid) {
      this.isLoading = false;
      return;
    }
    this.authenticationService.login(self.pwForm.value).pipe(first()).subscribe(data => {
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
}
