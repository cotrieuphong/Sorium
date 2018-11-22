import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { ProvinceService } from '../_services/province.service';
import { UserService } from '../_services/user.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
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
  ownerForm: FormGroup;
  citys: City[] = [];
  districts: District[] = [];
  filteredCitys: Observable<City[]>;
  filteredDistricts: Observable<District[]>;
  getPaging;
  provinceCode;
  disabled = true;
  fileList: UploadFile[] = [];
  Images: string[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private msg: NzMessageService,
    private nz: NzNotificationService,
    private provinceService: ProvinceService,
    private userService: UserService) { }

  handleChange({ file, fileList }): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  }

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
        this.ownerForm.get('DistrictCode').enable();
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

  private _FileToBase64(file :any){
    return new Promise((resolve, reject) => {
      const Reader = new FileReader();
      Reader.onload = function(){
        let base64 = "data:image/png;"+btoa(Reader.result);
        resolve(base64);
      }

      Reader.onerror = function(){
        reject(false);
      }
      Reader.readAsDataURL(file);
    });
  }

  beforeUpload = (file: UploadFile): boolean => {
    this._FileToBase64(file)
    .then((rs: any) => {
      this.Images.push(rs);
    });
    this.fileList.push(file);
    return false;
  }

  signup() {
    let formData = this.ownerForm.value;
    formData.Image = this.Images;
    formData.ProvinceCode = this.ownerForm.get('ProvinceCode').value.ProvinceCode;
    formData.DistrictCode = this.ownerForm.get('DistrictCode').value.DistrictCode;
    console.log(formData);
    this.userService.ownerSignup(formData).subscribe(res => {
      this.nz.create('success', 'Thành công', 'Đăng ký thành công', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      })

    },
    error => {
      console.log(error);
      // this.nz.create('error', 'Lỗi', 'Sai thông tin đăng ký', {
      //   nzDuration: 2500,
      //   nzAnimate: true,
      //   nzPauseOnHover: true
      // });
    }
  )}
}
