import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import { UserService } from '../_services/user.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import * as $ from 'jquery';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit{
  tokenKey;
  userInfo: any = [];
  userForm : FormGroup;
  pwForm : FormGroup;
  Avatar;
  formData;
  isRead = true;
  isChange = false;
  constructor(
    private userService: UserService,
    private nz: NzNotificationService,
    private router: Router,
    private change: ChangeDetectorRef,
    private fb: FormBuilder,) {
      this.tokenKey = localStorage.getItem('tokenKey');
      this.userForm = this.fb.group({
        FirstName: ['',[
          Validators.required
        ]],
        LastName: ['',[
          Validators.required
        ]],
        Email: ['',[
          Validators.required,
          Validators.email
        ]],
        PhoneNumber: ['',[
          Validators.required
        ]],
        Address: ['',[
          Validators.required
        ]],
        Id: ''
      })
      this.pwForm = this.fb.group({
        OldPassword: ['',[
          Validators.required
        ]],
        NewPassword: ['',[
          Validators.required
        ]]
      })
  }

  ngOnInit() {
    if(this.tokenKey){
      this.userService.getUser(this.tokenKey).subscribe((res:any) => {
        this.Avatar = res.Data.UserAvatar;
        this.userInfo = res.Data;
        this.userForm.get('FirstName').setValue(this.userInfo.FirstName)
        this.userForm.get('LastName').setValue(this.userInfo.LastName)
        this.userForm.get('Email').setValue(this.userInfo.Email)
        this.userForm.get('PhoneNumber').setValue(this.userInfo.PhoneNumber)
        this.userForm.get('Address').setValue(this.userInfo.Address)
        this.userForm.get('Id').setValue(this.userInfo.Id)
      },
      error => {
        this.router.navigate(['/dang-nhap'])
      });
    }
  }


  get FirstName() {
    return this.userForm.get('FirstName')
  }
  get LastName() {
    return this.userForm.get('LastName')
  }
  get Email() {
    return this.userForm.get('Email')
  }
  get PhoneNumber() {
    return this.userForm.get('PhoneNumber')
  }
  get Address() {
    return this.userForm.get('Address')
  }
  get OldPassword() {
    return this.pwForm.get('OldPassword')
  }
  get NewPassword() {
    return this.pwForm.get('NewPassword')
  }

  update() {
    this.isRead = !this.isRead
  }

  changePw() {
    this.isChange = !this.isChange
  }

  updateInfo() {
    this.userService.updateUser(this.userForm.value).subscribe((res:any) => {
      this.nz.create('success', 'Thành công', 'Cập nhật thông tin thành công', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      });
      this.update()
    },error => {
      this.nz.create('error', 'Lỗi', 'Không cập nhật được thông tin', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      })
    })

  }

  changePassword() {
    let data = this.pwForm.value;
    this.userService.changePw(data).subscribe((res:any) => {
      this.nz.create('success', 'Thành công', 'Cập nhật thông tin thành công', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      });
      localStorage.removeItem('tokenKey');
      this.changePw();
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

  avatarUpload(e) {
		let self = this
		let reader = new FileReader()
		if(e.target.files && e.target.files.length) {
			if (e.target.files) {
				var fileType = e.target.files[0].name.split('.').pop()
				if (fileType == 'png' || fileType == 'jpg' || fileType == 'jpeg') {
					const file = e.target.files[0];
          let data = new FormData();
          data.append("UserAvatar", file);
          this.userService.avatarUpload(data).subscribe((res:any) => {
              this.nz.create('success', 'Thành công', 'Thay ảnh đại diện thành công', {
                nzDuration: 2500,
                nzAnimate: true,
                nzPauseOnHover: true
              });
              reader.readAsDataURL(file);
    					reader.onload = () => {
    						$('.userAvatar').attr('src', reader.result);}
            },error => {
              self.nz.create('error', 'Lỗi', 'Sai định dạng ảnh', {
                nzDuration: 2500,
                nzAnimate: true,
                nzPauseOnHover: true
              })
            })
					setTimeout(function() {
						self.change.markForCheck();
					}, 1000)
				} else {
          self.nz.create('error', 'Không đúng định dạng ảnh', 'Chỉ nhận ảnh định dạng png, jpg, jpeg', { nzDuration: 2000 })
				}
			}
		}
	}


}
