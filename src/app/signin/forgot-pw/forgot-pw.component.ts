import { Component, ViewEncapsulation, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from "@angular/router";
import { first } from 'rxjs/operators';
import { UserService } from '../../_services/user.service';
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
    private authenticationService: AuthenticationService,
    private userService: UserService) {}

  ngOnInit(){
    this.pwForm = this.fb.group({
      Email: ['', [
        Validators.required,
        Validators.email
      ]],
      UrlForm: window.location.origin + '%23/doi-mat-khau'
    });
  }

  get Email() {
    return this.pwForm.get('Email')
  }

  forgetPw() {
    this.isLoading = true;
    const self = this;
    if (self.pwForm.invalid) {
      this.isLoading = false;
      return;
    }
    this.userService.forgotPw(self.pwForm.value).pipe(first()).subscribe(data => {
      self.isLoading = false;
      self.nz.create('success', 'Thành công', 'Mời bạn kiểm tra emai', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      })
    },
    error => {
      self.isLoading = false;
      self.nz.create('error', 'Lỗi', 'Sai email', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      });
    }
  )

}
}
