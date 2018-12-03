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
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.queryParamMap.get('Token');
    console.log(id);
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

  }

}
