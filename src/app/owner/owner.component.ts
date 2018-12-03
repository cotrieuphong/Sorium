import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { ProvinceService } from '../_services/province.service';
import { UserService } from '../_services/user.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { Gallery, GalleryItem, ImageItem, GalleryConfig, ThumbnailsPosition } from '@ngx-gallery/core';
import {map, startWith, debounceTime, tap, finalize, distinctUntilChanged} from 'rxjs/operators';
import * as $ from 'jquery';
export interface City {
  Id: number;
  ProvinceCode: string;
  ProvinceName: string;
}
export interface District {
  Id: number;
  DistrictCode: string;
  DistrictName: string;
}
@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OwnerComponent implements OnInit {
  // Form
  ownerForm: FormGroup;
  // Autocomplete
  citys: City[] = [];
  districts: District[] = [];
  filteredCitys: Observable<City[]>;
  filteredDistricts: Observable<District[]>;
  // Pagong
  getPaging;
  provinceCode;
  // Loading
  isUploading = false;
  isSubmiting = false;
  // Gallery
  galleryImageList = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private msg: NzMessageService,
    private nz: NzNotificationService,
    private provinceService: ProvinceService,
    private userService: UserService,
    public gallery: Gallery) { }

  ngOnInit() {
    this.ownerForm = this.fb.group({
      HotelName: ["",[
        Validators.required,
      ]],
      HotelEmail: ["",[
        Validators.required,
        Validators.email
      ]],
      HotelPhoneNumber: ["",[
        Validators.required,
        Validators.pattern(/^-?(0|[0-9]\d*)?$/),
        Validators.minLength(9),
        Validators.maxLength(10)
      ]],
      HotelAddress: ["",[
        Validators.required
      ]],
      DistrictCode: ["",[
        Validators.required
      ]],
      ProvinceCode: ["",[
        Validators.required
      ]],
      TaxCode: ["",[
        Validators.required
      ]],
      HotelStar: ["",[
        Validators.required
      ]],
      Description: ""
    });

    this.provinceService.getProvince().subscribe((data:any) => {
      this.citys = data.DataList;
      this.filteredCitys = this.ownerForm.get('ProvinceCode').valueChanges.pipe(
        startWith<string | City>(''),
        map(value => typeof value === 'string' ? value : value.ProvinceName),
        map(name => name ? this._filter(name) : this.citys.slice()),
      )
    });

    this.ownerForm.get('DistrictCode').disable();

    this.ownerForm.get('ProvinceCode').valueChanges.pipe(debounceTime(1000)).subscribe(selectedProvince => {
      this.ownerForm.get('DistrictCode').reset();
      this.provinceCode = selectedProvince.ProvinceCode;
      if(selectedProvince != "" && this.provinceCode != null){
        this.getPaging = {
          PageSize: 999999,
          PageIndex: 1,
          FilterRules: [
            {
              field: "ProvinceCode",
              op: "=",
              value: this.provinceCode
            }
          ]
        };

        this.provinceService.getDistrict(this.getPaging).subscribe((data:any) => {
          this.districts = data.DataList;
          this.filteredDistricts = this.ownerForm.get('DistrictCode').valueChanges.pipe(
            startWith<string | District>(''),
            map(value => typeof value === 'string' ? value : value.DistrictName),
            map(name => name ? this._dfilter(name) : this.districts.slice()),

          )
          this.ownerForm.get('DistrictCode').enable();
        })
      }
      else{
        this.ownerForm.get('district').disable();
      }

    });

    $(function(){
      $('.sticky-search-wrapper').remove();
    })
  }

  get HotelName() {
    return this.ownerForm.get('HotelName')
  }
  get HotelEmail() {
    return this.ownerForm.get('HotelEmail')
  }
  get HotelPhoneNumber() {
    return this.ownerForm.get('HotelPhoneNumber')
  }
  get HotelAddress() {
    return this.ownerForm.get('HotelAddress')
  }
  get DistrictCode() {
    return this.ownerForm.get('DistrictCode')
  }
  get ProvinceCode() {
    return this.ownerForm.get('ProvinceCode');
  }
  get TaxCode() {
    return this.ownerForm.get('TaxCode')
  }
  get HotelStar() {
    return this.ownerForm.get('HotelStar')
  }
  get Description() {
    return this.ownerForm.get('Description')
  }

  displayFn(city?: City): string | undefined {
    return city ? city.ProvinceName : undefined;
  }

  private _filter(ProvinceName: string): City[] {
    const filterValue = ProvinceName.toLowerCase();

    return this.citys.filter(city => city.ProvinceName.toLowerCase().includes(filterValue));
  }
  displaydFn(district?: District): string | undefined {
    return district ? district.DistrictName : undefined;
  }

  private _dfilter(DistrictName: string): District[] {
    const filterValue = DistrictName.toLowerCase();

    return this.districts.filter(district => district.DistrictName.toLowerCase().includes(filterValue));
  }

  // private _FileToBase64(file :any){
  //   return new Promise((resolve, reject) => {
  //     const Reader = new FileReader();
  //     Reader.onload = function(e: any){
  //       let base64 = e.target.result;
  //       resolve(base64);
  //     }
  //
  //     Reader.onerror = function(){
  //       reject(false);
  //     }
  //     Reader.readAsDataURL(file);
  //   });
  // }

  galleryUpload(e) {
		let self = this;
    self.isUploading = true;
		if(e.target.files && e.target.files.length) {
			if (e.target.files) {
				for (var i = 0; i < e.target.files.length; ++i) {
					var fileType = e.target.files[i].name.split('.').pop()
					if (fileType == 'png' || fileType == 'jpg' || fileType == 'jpeg') {
						let file = e.target.files[i];
            let size = file.size;
						let reader = new FileReader();
            if(size <= 2*1024*1024){
              console.log(size);
              reader.readAsDataURL(file)
  						reader.onload = () => {
  							self.galleryImageList.push(reader.result);
                self.isUploading = false;
  						}
            }else{
              console.log(size);
              self.nz.create('error', 'Lỗi', 'File phải nhỏ hơn 2Mb', {
                nzDuration: 2500,
                nzAnimate: true,
                nzPauseOnHover: true
              });
              self.isUploading = false;
            }
					} else {
						self.nz.create('error', 'Không đúng định dạng ảnh', 'Chỉ nhận ảnh định dạng png, jpg, jpeg', {
              nzDuration: 2500,
              nzAnimate: true,
              nzPauseOnHover: true
            })
            self.isUploading = false;
					}
				}
			}
		}
	}

  deleteImage(value) {
		let self = this
		if (self.galleryImageList.indexOf(value) > -1) {
			self.galleryImageList.splice(self.galleryImageList.indexOf(value), 1)
		}
	}

  signup() {
    this.isSubmiting = true;
    let formData = this.ownerForm.value;
    formData.Image = this.galleryImageList;
    formData.ProvinceCode = this.ownerForm.get('ProvinceCode').value.ProvinceCode;
    formData.DistrictCode = this.ownerForm.get('DistrictCode').value.DistrictCode;
    console.log(formData);
    this.userService.ownerSignup(formData).subscribe(res => {
      this.nz.create('success', 'Thành công', 'Đăng ký thành công', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      }),
      this.isSubmiting = false;
      this.router.navigate(['/xac-nhan-chu-khach-san'])
    },
    error => {
      console.log(error);
      this.nz.create('error', 'Lỗi', 'Sai thông tin đăng ký', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      });
      this.isSubmiting = true;
    }
  )}
}
