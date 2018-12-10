import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { HotelService } from '../_services/hotel.service';
import { ProvinceService } from '../_services/province.service';
import { map, startWith, debounceTime, first } from 'rxjs/operators';
import { MatPaginator } from '@angular/material';
import {PageEvent} from '@angular/material';
import { Observable } from 'rxjs';
import * as $ from 'jquery';

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
  // Masonry
  masonryOpt = {
    itemSelector: '.search-item',
    gutter: 16,
    horizontalOrder: true,
    percentPosition: true,
    stagger: 30
  }
  // Paginator
  total;
  length;
  pageSize = 12;
  pageEvent: PageEvent;
  pageSizeOptions: number[] = [6, 12, 24, 48];
  showHotel: any = [];
  // Hotel
  status = false;
  hotels:any = [];
  tags:any = [];
  services:any = [];
  stars;
  price;
  curency;
  getPaging;
  navigationExtra: NavigationExtras;
  isLoading = false;
  loadingScreen = true;
  notFound = false;
  public location: string;
  public locationCode: string;
  public checkin: any;
  public checkout: any;
  public people: number;
  public day: number;

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
  range;
  dr;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private hotelService : HotelService,
    private provinceService: ProvinceService,
    private fb: FormBuilder) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.location = params["location"];
      this.locationCode = params["locationCode"]
      this.people = params["people"];
      this.checkin = new Date(params["checkin"]);
      this.checkout = new Date(params["checkout"]);
      this.day = parseInt(params["day"]);
    });
    this.minDate.getDate;
    // Autocomplete
    this.searchKeyControl = new FormControl();
    // Search Form
    this.pplCount = 1;

  }

  ngOnInit() {
    // Paginator
    this.paginator._intl.itemsPerPageLabel = 'Khách sạn';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 trên ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} trên ${length}`; }

    // Search Form
    this.searchForm = this.fb.group({
      searchLocation: '',
      searchDate: [],
      peopleCount: 1,
      dayDiff: 1
    });

    let cityItem:City ={
      Id: null,
      ProvinceCode: this.locationCode,
      ProvinceName: this.location
    }

    if(this.location == ''){
      this.searchForm.get('searchLocation').setValue(cityItem);
    }
    this.searchForm.get('searchDate').setValue([this.checkin,this.checkout]);
    console.log(this.searchForm.get('searchDate').value)
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

    // Paging
    this.getPaging = {
      PageSize: 999999,
      PageIndex: 1,
      FilterRules: [
        {
          field: "MaxAdults",
          op: "greater",
          value: this.people - 1
        }
      ],
      SortRules: []
    }
    this.getHotel()

    // Jquery
    $(function(){

      $('.search-filter mat-form-field').click(function(){
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

      $('.search-filter').submit(function(){
        $('body').removeClass('no-scroll');
        $('.search-overlay').removeClass('show');
      })

      $('.prevent-input').keydown(function(e) {
        e.preventDefault();
        e.stopPropagation()
      });
    })

  }

  // Paginator
  setPageSizeOptions(setPageSizeOptionsInput: string) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }

  getPage(e):any{
    let firstCut = e.pageIndex * e.pageSize;
    let secondCut = firstCut + e.pageSize;
    this.showHotel = this.hotels.slice(firstCut,secondCut);
  }

  // Search

  tagSearch(tag){
    this.getPaging = {
      PageSize: 999999,
      PageIndex: 1,
      FilterRules: [
        {
          field: "Tags",
          op: "contains",
          value: tag
        },
        {
          field: "MaxAdults",
          op: "greater",
          value: this.people - 1
        }
      ]
    }
    this.getHotel(this.getPaging);
  }

  serviceSearch(service){
    this.getPaging = {
      PageSize: 999999,
      PageIndex: 1,
      FilterRules: [
        {
          field: "Services",
          op: "contains",
          value: service
        },
        {
          field: "MaxAdults",
          op: "greater",
          value: this.people - 1
        }
      ]
    }
    this.getHotel(this.getPaging);
  }

  private getHotel(paging?){
    if(!paging){
      if(!this.location){
        paging = this.getPaging = {
          PageSize: 999999,
          PageIndex: 1,
          FilterRule: [
            {
              field: 'Status',
              op: '=',
              value: 1
            },
            {
              field: "MaxAdults",
              op: "greater",
              value: this.people - 1
            }
          ]
        }
      }else{
        paging = this.getPaging = {
          PageSize: 999999,
          PageIndex: 1,
          FilterRules: [
            {
              field: 'Status',
              op: '=',
              value: 1
            },
            {
              field: "ProvinceCode",
              op: "=",
              value: this.locationCode
            },
            {
              field: "MaxAdults",
              op: "greater",
              value: this.people
            }
          ]
        }
      }
    }
    this.loadingScreen = true;
    this.notFound = false;
    this.hotelService.getHotel(paging).subscribe((res:any) => {
      this.total = res.TotalRecords;
      if(!res.DataList.length){
        this.notFound = true;
      }
      this.length = res.TotalRecords;
      console.log(res);
      let n = res.DataList.length;
      for(let i = 0; i < n ; i++){
        if(res.DataList[i].Services){
          this.services = JSON.parse(res.DataList[i].Services);
          res.DataList[i].Services = this.services;
        }
        if(res.DataList[i].Tags){
          this.tags = (res.DataList[i].Tags).split(",");
          let m = this.tags.length;
          if(m < 5){
            this.tags.length = m;
          }else{
            this.tags.length = 4
          }

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
      this.showHotel = this.hotels.slice(0,this.pageSize)
      setTimeout(() => {
        $('.trigger').click(function(){
          $(this).toggleClass('show');
          $(this).parent().find('.info').toggleClass('show');
        })
        this.isLoading = false;
        this.loadingScreen = false;
      },1000)
    })
  };

  get searchLocation() {
    return this.searchForm.get('searchLocation')
  };

  // get searchDate() {
  //   return this.searchForm.get('searchDate')
  // };

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

  suggest() {
    this.getPaging = {
      PageSize: 999999,
      PageIndex: 1,
      FilterRules: [
        {
          field: "MaxAdults",
          op: "greater",
          value: this.people - 1
        }
      ]
    }
    this.getHotel(this.getPaging)
  }

  priceDown() {
    this.getPaging = {
      PageSize: 12,
      PageIndex: 1,
      FilterRules: [
        {
          field: "MaxAdults",
          op: "greater",
          value: this.people - 1
        }
      ],
      SortRules: [
        {
          field: "MinPrice",
          value: "DESC"
        }
      ]
    }
    this.getHotel(this.getPaging)
  }

  priceUp() {

    this.getPaging = {
      PageSize: 12,
      PageIndex: 1,
      FilterRules: [
        {
          field: "MaxAdults",
          op: "greater",
          value: this.people - 1
        }
      ],
      SortRules: [
        {
          field: "MinPrice",
          value: "ASC"
        }
      ]
    }
    this.getHotel(this.getPaging)
  }

  submit() {

    this.isLoading = true;
    this.submitData = this.searchForm.value;
    console.log(this.submitData);
    let  day1 = this.submitData.searchDate[0].getTime();
    let  day2 = this.submitData.searchDate[1].getTime();
    let  dd = Math.abs(day1 - day2);
    this.submitData.dayDiff = Math.round(dd/(1000*60*60*24));

    let data = this.searchForm.get('searchLocation').value
    if(data.location == ''){
      this.getHotel()
    }
    this.getPaging = {
      PageSize: 999999,
      PageIndex: 1,
      FilterRules: [
        {
          field: "ProvinceCode",
          op: "=",
          value: data.ProvinceCode
        },
        {
          field: 'Status',
          op: '=',
          value: 1
        },
        {
          field: "MaxAdults",
          op: "greater",
          value: data.people - 1
        }
      ]
    }
    this.getHotel(this.getPaging)
  }

  ngAfterViewInit() {

  }

}
