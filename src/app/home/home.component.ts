import { Component, ViewEncapsulation, OnInit, AfterViewInit} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import {map, startWith, debounceTime, tap, finalize} from 'rxjs/operators';
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
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-dark-blue'
  }
  minDate= new Date();
  // Autocomplete
  searchKeyControl: FormControl;
  citys: City[] = [];
  filteredCitys: Observable<City[]>;

  // Search Form
  searchForm: FormGroup;
  pplCount: any;
  submitData: any;
  searchLocation;

  // Loading Screen
  isLoading = false;
  loadingContent = true;

  // Comment
  comments = [
    {
      hotelName: "Khách sạn Sydney Boulevard",
      hotelLocation: "Hà Nội",
      description: "Giá phòng Executive hướng thành phố trên Sorium rất phải chăng. Đúng là một món hời!",
      user: "Cồ Triệu Phong",
      userLocation: "Đà Nẵng"
    },
    {
      hotelName: "Khách sạn Eucalyptus",
      hotelLocation: "Hải Phòng",
      description: "Chúng tôi đã đặt phòng ở khách sạn Eucalyptus qua Sorium sau khi xem qua rất nhiều đánh giá hữu ích. Nhờ đó giúp chúng tôi đưa ra quyết định tốt nhất thật dễ dàng khi du lịch đến Hải Phòng.",
      user: "Vũ Minh Hiếu",
      userLocation: "Bắc Ninh"
    },
    {
      hotelName: "Khách sạn Granvia Kyoto",
      hotelLocation: "Hồ Chí Minh",
      description: "Gia đình chúng tôi vừa đi tàu tốc hành qua các thành phố ở Nhật Bản cùng nhiều hành lý nên vị trí của khách sạn này thật thuận tiện cho chúng tôi. Giá phòng trên Agoda cũng rất tuyệt vời.",
      user: "Lê Quanh Minh",
      userLocation: "Hà Nội"
    }
  ]

  // Param
  param;

  constructor(private data: DataService, private fb: FormBuilder, private router: Router) {
    // Date Range Picker
    this.minDate.setDate;
    // Autocomplete
    this.searchKeyControl = new FormControl();
    // Search Form
    this.pplCount = 1;
    this.submitData = '';
  }

  ngOnInit() {
    // Search Form
    this.searchForm = this.fb.group({
      searchLocation: '',
      searchDate:'',
      peopleCount:1
    });
    // this.searchForm.valueChanges.subscribe(console.log);

    // Autocomplete
    this.data.getProvinces().subscribe((data:any) => {
      this.citys = data.DataList;
      this.filteredCitys = this.searchForm.get('searchLocation').valueChanges.pipe(
        startWith<string | City>(''),
        map(value => typeof value === 'string' ? value : value.ProvinceName),
        map(name => name ? this._filter(name) : this.citys.slice()),
      )
    })

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

      $('.sticky-search-wrapper').hide();

    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadingContent = false
    }, 2000)
  }

  displayFn(city?: City): string | undefined {
    return city ? city.ProvinceName : undefined;
  }

  private _filter(ProvinceName: string): City[] {
    const filterValue = ProvinceName.toLowerCase();

    return this.citys.filter(city => city.ProvinceName.toLowerCase().includes(filterValue));
  }

  addPeople() {
    this.pplCount += 1;
    if(this.pplCount >= 12){
      this.pplCount = '+12'
    }
    this.searchForm.get('peopleCount').setValue(this.pplCount)
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
    this.submitData = this.searchForm.value;
    let navigationExtras : NavigationExtras = {
      queryParams: {
        "location": this.submitData.searchLocation.ProvinceCode,
        "checkin": this.submitData.searchDate[0],
        "checkout": this.submitData.searchDate[1],
        "people": this.submitData.peopleCount
      }
    }
    setTimeout(() => {
      this.router.navigate(['/ket-qua'], navigationExtras);
      this.isLoading = false
    }, 1000)
  }
}
