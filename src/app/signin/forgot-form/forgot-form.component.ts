import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { UserService } from '../../_services/user.service';
@Component({
  selector: 'app-forgot-form',
  templateUrl: './forgot-form.component.html',
  styleUrls: ['./forgot-form.component.scss']
})
export class ForgotFormComponent implements OnInit {
  pwForm : FormGroup;
  hide = true;
  isLoading = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private nz: NzNotificationService
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.queryParamMap.get('Token');
    console.log(id);
    this.pwForm = this.fb.group({
      NewPassword: ['', [
        Validators.required
      ]],
      ConfirmPassword: ['',[
        Validators.required
      ]],
      UrlForm: window.location.origin + '/#/doi-mat-khau'
    });
  }

  get NewPassword() {
    return this.pwForm.get('NewPassword')
  }
  get ConfirmPassword() {
    return this.pwForm.get('ConfirmPassword')
  }

  forgetPw() {
    let data = this.pwForm.value;
    this.userService.updatePw(data).subscribe((res:any) => {
      this.nz.create('success', 'Thành công', 'Cập nhật thông tin thành công', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      });
      setTimeout(() => {
        this.router.navigate(['/dang-nhap']);
      },1000)
    },error => {
      this.nz.create('error', 'Lỗi', 'Không cập nhật được thông tin', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      })
    })
  }

}
