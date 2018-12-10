import { Component, ViewEncapsulation, OnInit, AfterViewInit} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { HotelService } from '../_services/hotel.service';
import { ProvinceService } from '../_services/province.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { map, startWith, debounceTime, switchMap} from 'rxjs/operators';
import * as $ from 'jquery';

export interface City {
  Id: number;
  ProvinceCode: string;
  ProvinceName: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {

  // Date Range Picker
  bsConfig={
    containerClass: 'theme-dark-blue'
  }
  minDate = new Date();
  minDay = new Date();

  // Autocomplete
  searchKeyControl: FormControl;
  citys: City[] = [];
  filteredCitys: Observable<City[]>;

  // Search Form
  searchForm: FormGroup;
  submitData: any;
  pplCount: number;
  // Loading Screen
  isLoading = false;
  loadingContent = true;
  provinceLoad = false;
  cityLoad = false;
  hotelLoad = false;
  cmtLoad = false;
  // Comment
  comments:any = [];

  // Get Paging
  hotelPaging;
  provincePaging;
  promoteHotel;
  promoteProvince;

  constructor(
    private hotelService: HotelService,
    private provinceService: ProvinceService,
    private fb: FormBuilder,
    private router: Router) {
    // Date Range Picker
    this.minDate.setDate;
    // Autocomplete
    this.searchKeyControl = new FormControl();
    // Search Form
    this.minDay.setDate(this.minDay.getDate() + 1)
    this.submitData = '';
    this.pplCount = 1;
  }

  ngOnInit() {

    // Search Form
    this.searchForm = this.fb.group({
      searchLocation: '',
      searchDate: '',
      peopleCount: null,
      dayDiff: 1
    });

    // Autocomplete
    this.provinceService.getProvince().subscribe((res:any) => {
      this.citys = res.DataList;
      this.filteredCitys = this.searchForm.get('searchLocation').valueChanges.pipe(
        startWith<string | City>(''),
        map(value => typeof value === 'string' ? value : value.ProvinceName),
        map(name => name ? this._filter(name) : this.citys.slice())
      )
      this.provinceLoad = true;
      if(this.provinceLoad == true && this.cityLoad == true && this.hotelLoad == true && this.cmtLoad == true){
        this.loadingContent = false;
      }
    })

    // Get Hotel Paging
    this.hotelPaging = {
      PageSize: 3,
      PageIndex: 1,
      SortRules: [
        {
          field: "Id",
          value: "DESC"
        }
      ]
    };
    this.hotelService.getHotel(this.hotelPaging).subscribe((res:any) => {
      this.promoteHotel = res.DataList.map((item:any)=>{
        item.Avatar = "https://luxuria-api.azurewebsites.net"+item.Avatar;
        return item;
      });
      this.hotelLoad = true;
      if(this.provinceLoad == true && this.cityLoad == true && this.hotelLoad == true && this.cmtLoad == true){
        setTimeout(() => this.loadingContent = false,1000)
      }
    });

    // Comment
    this.hotelService.getTop3().subscribe((res:any) => {
      this.comments = res.DataList;
      this.cmtLoad = true
    })

    // Get Province Paging
    this.provincePaging = {
      PageSize: 9,
      PageIndex: 1
    };

    this.provinceService.getProvincePaging(this.provincePaging).subscribe((res:any) => {
      this.promoteProvince = res.DataList;
      this.cityLoad = true;

      if(this.provinceLoad == true && this.cityLoad == true && this.hotelLoad == true && this.cmtLoad == true){
        this.loadingContent = false;
      }

    });



    // Jquery
    $(function(){
      $(window).scroll(function(){
        if($('.rumor-wrapper').length){
          if (
            $(window).scrollTop() >
            window.innerHeight - $(".rumor-wrapper").offset().top + 200) {
            $(".rumor").addClass("fade-in");

          };
        }
      })

      $('mat-form-field').click(function(){
        $(this).find('input').focus();
        $('.search-overlay, mat-form-field, .search-confirm').addClass('show');
        $('html, body').animate({
          scrollTop: $('.hero-search').offset().top
        }, 300);
        $('body').addClass('no-scroll');
      });

      $('.search-peoples').click(function(){
        $('.people-count').addClass('show')
      });

      $('.search-peoples').siblings().click(function(){
        $('.people-count').removeClass('show');
      })

      $('.search-overlay').click(function(){
        $(this).removeClass('show');
        $('mat-form-field, .search-confirm, .people-count').removeClass('show');
        $('body').removeClass('no-scroll');
      });

      $('.search-form').submit(function(){
        $('body').removeClass('no-scroll');
      })

      $('.prevent-input').keypress(function(e) {
        e.preventDefault();
      });

    })
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.loadingContent = false
    // }, 2000)
  }

  get searchLocation() {
    return this.searchForm.get('searchLocation')
  };

  get searchDate() {
    return this.searchForm.get('searchDate')
  };

  change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      " "
    );
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
  }

  resetInput(){
    this.searchForm.get('searchLocation').setValue('');
  }

  displayFn(city?: City): string | undefined {
    return city ? city.ProvinceName : undefined;
  }

  private _filter(ProvinceName: string): City[] {
    const filterValue = this.change_alias(ProvinceName);

    return this.citys.filter(city => this.change_alias(city.ProvinceName).includes(filterValue));
  }

  setPpl() {
    if(!this.searchForm.get('peopleCount').value){
      this.searchForm.get('peopleCount').setValue(1);
    }
  }

  addPeople() {
    this.pplCount += 1;
    if(this.pplCount >= 12){
      this.pplCount = 12
      this.searchForm.get('peopleCount').setValue(this.pplCount+'+')
    }else{
      this.searchForm.get('peopleCount').setValue(this.pplCount)
    }
  }
  removePeople() {
    this.pplCount -= 1;
    if(this.pplCount <= 1){
      this.pplCount = 1
    }
    this.searchForm.get('peopleCount').setValue(this.pplCount)
  }

  async submitHandler() {
    this.isLoading = true;
    if(this.searchForm.get('searchDate').value == ''){
      this.searchForm.get('searchDate').setValue([this.minDate, this.minDay])
    }
    if(this.searchForm.get('peopleCount').value == null){
      this.searchForm.get('peopleCount').setValue(1)
    }
    this.submitData = this.searchForm.value;
    let  day1 = this.submitData.searchDate[0].getTime();
    let  day2 = this.submitData.searchDate[1].getTime();
    let  dd = Math.abs(day1 - day2);
    this.submitData.dayDiff = Math.round(dd/(1000*60*60*24));
    let navigationExtras : NavigationExtras = {
      queryParams: {
        "location": this.submitData.searchLocation.ProvinceName,
        "locationCode": this.submitData.searchLocation.ProvinceCode,
        "checkin": this.submitData.searchDate[0].toLocaleDateString(),
        "checkout": this.submitData.searchDate[1].toLocaleDateString(),
        "people": this.submitData.peopleCount,
        "day": this.submitData.dayDiff,
      }
    }
    setTimeout(() => {
      this.router.navigate(['/ket-qua'], navigationExtras);
      this.isLoading = false
    }, 1000)
  }

  selectHotel(id) {
    let navigationExtras : NavigationExtras = {
      queryParams: {
        "location": '',
        "checkin": this.minDate.toJSON().split('T')[0],
        "checkout": this.minDay.toJSON().split('T')[0],
        "people": 1,
        "day": 1,
        "hotel": id
      }
    }
    this.router.navigate(['/chi-tiet'], navigationExtras);
  }

  selectProvince(id) {
    let navigationExtras : NavigationExtras = {
      queryParams: {
        "location": '',
        "checkin": this.minDate.toJSON().split('T')[0],
        "checkout": this.minDay.toJSON().split('T')[0],
        "people": 1,
        "day": 1,
        "province": id
      }
    }
    this.router.navigate(['/tinh-thanh/chi-tiet'], navigationExtras);
  }

}
