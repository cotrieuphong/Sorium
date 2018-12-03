import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { HotelService } from '../_services/hotel.service';
import { ProvinceService } from '../_services/province.service';
import { map, startWith, debounceTime, first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as $ from 'jquery';
import { Masonry, MasonryGridItem } from 'ng-masonry-grid'

export interface City {
  Id: number;
  ProvinceCode: string;
  ProvinceName: string;
}


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResultComponent implements OnInit {

  masonryOpt = {
    itemSelector: '.search-item',
    gutter: 16,
    horizontalOrder: true,
    percentPosition: true,
    stagger: 30
  }
  status = false;
  hotels = [];
  tags;
  services;
  stars;
  price;
  curency;
  getPaging;
  navigationExtra: NavigationExtras
  isLoading = false;
  loadingScreen = true;
  notFound = false;
  public location: string;
  public locationId: number;
  public checkin: any;
  public checkout: any;
  public people: number;
  public day: number;

  // Date Range Picker
  bsConfig={
    dateInputFormat: 'DD-MM-YYYY',
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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private hotelService : HotelService,
    private provinceService: ProvinceService,
    private fb: FormBuilder) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.location = params["location"];
      this.locationId = params["locationId"]
      this.people = params["people"];
      this.checkin = params["checkin"];
      this.checkout = params["checkout"];
      this.day = params["day"]
    });
    console.log(this.location, this.checkin, this.checkout);
    this.minDate.getDate;
    // Autocomplete
    this.searchKeyControl = new FormControl();
    // Search Form
    this.submitData = '';
    this.pplCount = 1;
  }

  ngOnInit() {

    // Search Form
    this.searchForm = this.fb.group({
      searchLocation: '',
      searchDate: '',
      peopleCount: 1,
      dayDiff: 1
    });

    if(this.location == ''){
      this.searchForm.get('searchLocation').patchValue(this.location);
      console.log(this.searchForm.get('searchLocation').value)
    }
    this.searchForm.get('searchLocation').patchValue(this.location);
    this.searchForm.get('searchDate').setValue([this.checkin, this.checkout]);
    this.searchForm.get('peopleCount').setValue(this.people);
    this.searchForm.get('dayDiff').setValue(this.day);


    // Autocomplete
    this.provinceService.getProvince().subscribe((res:any) => {
      this.citys = res.DataList;
      this.filteredCitys = this.searchForm.get('searchLocation').valueChanges.pipe(
        startWith<string | City>(''),
        map(value => typeof value === 'string' ? value : value.ProvinceName),
        map(name => name ? this._filter(name) : this.citys.slice())
      )
    })

    // Get Hotel
    if(this.location == ''){
      this.getPaging = {
        PageSize: 20,
        PageIndex: 1
      }
    }else{
      this.getPaging = {
        PageSize: 20,
        PageIndex: 1,
        FilterRules: [
          {
            field: "ProvinceCode",
            op: "=",
            value: this.locationId
          },
          {
            field: "Adults",
            op: ">",
            value: this.people - 1
          }
        ]
      }
    }
    this.hotelService.getHotel(this.getPaging).subscribe(async(res:any) => {
      if(!res.DataList.length){
        this.notFound = true;
      }
      let n = res.DataList.length;
      for(let i = 0; i < n ; i++){
        if(res.DataList[i].Services){
          this.services = JSON.parse(res.DataList[i].Services);
          res.DataList[i].Services = this.services;
        }
        if(res.DataList[i].Tags){
          this.tags = (res.DataList[i].Tags).split(",");
          res.DataList[i].Tags = this.tags;
        }
        if(res.DataList[i].Stars){
          this.stars = parseInt((res.DataList[i].Stars));
          res.DataList[i].Stars = this.stars
        }
        this.price = res.DataList[i].MinPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        res.DataList[i].MinPrice = this.price;
      }
      this.hotels = res.DataList;
      if(await this.hotels){
        setTimeout(() => {
          this.loadingScreen = false;
        }, 3000)
      }
      console.log(this.hotels);
      $(function(){
        $('mat-form-field').click(function(){
          $(this).find('input').focus();
          $('.search-overlay').addClass('show');
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
          $('.people-count').removeClass('show');
          $('body').removeClass('no-scroll');
        });

        $('.search-form').submit(function(){
          $('body').removeClass('no-scroll');
          $('.search-overlay').removeClass('show');
        })

        $('.prevent-input').keypress(function(e) {
          e.preventDefault();
        });
      })
    })
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

  toggle() {

    const trigger = document.querySelector(".trigger");
    const parent = document.querySelector(".info");
    trigger.classList.toggle('show');
    parent.classList.toggle('show');
    console.log(trigger, parent);
        // $(this).toggleClass('show');
        // $(this).parent().find('.info').toggleClass('show')

  }

  selectHotel(id){
    let navigationExtras : NavigationExtras = {
      queryParams: {
        "location": this.location,
        "checkin": this.checkin,
        "checkout": this.checkout,
        "people": this.people,
        "day": this.day,
        "hotel": id
      }
    }
    this.router.navigate(['/chi-tiet'], navigationExtras);
  }

  priceDown() {
    this.getPaging = {
      PageSize: 2,
      PageIndex: 1,
    }
    this.hotelService.getHotel(this.getPaging).subscribe(async(res:any) => {
      console.log(res)
    })
  }

  submit() {
    this.isLoading = true;
    if(this.searchForm.get('searchDate').value == ''){
      this.searchForm.get('searchDate').setValue([this.minDate, this.minDay])
    }
    if(this.searchForm.get('peopleCount').value == null){
      this.searchForm.get('peopleCount').setValue(1)
    }
    this.submitData = this.searchForm.value;
    console.log(this.submitData);
    let  day1 = this.submitData.searchDate[0].getTime();
    let  day2 = this.submitData.searchDate[1].getTime();
    let  dd = Math.abs(day1 - day2);
    this.submitData.dayDiff = Math.round(dd/(1000*60*60*24));
    let navigationExtras : NavigationExtras = {
      queryParams: {
        "location": this.submitData.searchLocation.ProvinceName,
        "locationId": this.submitData.searchLocation.ProvinceCode,
        "checkin": this.submitData.searchDate[0].toJSON().split('T')[0],
        "checkout": this.submitData.searchDate[1].toJSON().split('T')[0],
        "people": this.submitData.peopleCount,
        "day": this.submitData.dayDiff
      }
    }
    setTimeout(() => {
      this.router.navigate(['/ket-qua'], navigationExtras);
      this.isLoading = false
    }, 1000)
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.loadingScreen = false;
    // }, 2000)
  }

}
