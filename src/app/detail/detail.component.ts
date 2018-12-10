import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { GalleryItem, ImageItem, GalleryConfig, ThumbnailsPosition } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
import { HotelService } from '../_services/hotel.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { MatPaginator } from '@angular/material';
import {PageEvent} from '@angular/material';
import { map } from 'rxjs/operators';
import * as $ from 'jquery';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DetailComponent implements OnInit {
  masonryOpt = {
    itemSelector: '.hg-item',
    gutter: 10,
    horizontalOrder: true,
    stagger: 30,
    percentPosition: true
  }
  // Paginator
  length;
  length2;
  pageSize = 6;
  pageEvent: PageEvent;
  showHotel: any = [];
  showHotel2: any = [];
  // Hotel
  hotel: any = [];
  hotelId;
  userId = sessionStorage.getItem('Id');
  paging;
  stars;
  curency;
  services:any = [];
  roomService: any = [];
  cmt: any = [];
  cmtPaging;
  navigationExtra: NavigationExtras;
  fbForm: FormGroup;
  token = localStorage.getItem('tokenKey');
  public location: string;
  public checkin: string;
  public checkout: string;
  public people: number;
  public day: number;
  slideToShow;
  heroConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "asNavFor": '.nav-carousel',
    "draggable": false,
    "autoplay": true,
    "infinite": true,
  };
  navConfig = {
    "slidesToShow": 5,
    "slidesToScroll": 1,
    "asNavFor": '.hero-carousel',
    "centerMode": true,
    "focusOnSelect": true,
    "responsive": [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };
  compare: any = [];
  compare2: any = [];
  FirstCompare: any = [];
  SecondCompare: any = [];
  loadingScreen = true;
  loadingHotel = true;
  isLoading = false;
  FirstVisible = false;
  SecondVisible = false;
  FirstHotelPick = false;
  SecondHotelPick = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private hotelService: HotelService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private nz: NzNotificationService,
    private router: Router) {
      this.activatedRoute.queryParams.subscribe(params => {
        this.location = null ? "" : params["location"];
        this.people = params["people"];
        this.checkin = null ? "" : params["checkin"];
        this.checkout = null ? "" : params["checkout"];
        this.day = null ? "" : params["day"];
        this.hotelId = params["hotel"];
      });
      this.fbForm = this.fb.group({
        Content: ['',[
        ]],
        HotelId: '',
        ParentId: 0
      })
    }

  ngOnInit() {

    this.getCmt();
    this.fbForm.get('HotelId').setValue(this.hotelId);
    this.paging = {
      PageSize: 999,
      PageIndex: 1
    }
    this.hotelService.getHotelById(this.hotelId, this.paging).subscribe(async(res:any) => {
      let n = res.Data.ListRoom.length;
      for(let i = 0; i < n ; i++){
        this.curency = res.Data.ListRoom[i].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        res.Data.ListRoom[i].Price = this.curency;

        this.roomService = JSON.parse(res.Data.ListRoom[i].Services)
        res.Data.ListRoom[i].Services = this.roomService

      }
      this.services = JSON.parse(res.Data.Services);
      let m = this.services.length;
      if(m < 6){
        this.services.length = m;
      }else{
        this.services.length = 5
      }
      res.Data.Services = this.services;
      this.stars = parseInt(res.Data.Stars);
      res.Data.Stars = this.stars;
      this.hotel = res.Data;
      if(await this.hotel){
        setTimeout(() => {
          this.loadingScreen = false;
        }, 3000)
      }
      console.log(this.hotel);
    })

    $(function(){
      $('.sticky-search-wrapper').remove();
      $('.ant-anchor-link-title').data("title", $('.ant-anchor-link-title').attr("title")).removeAttr("title");
    })
  }

  getHotelByProvince(code) {
    this.loadingHotel = true;
    let Paging = {
      PageSize: 999999,
      PageIndex: 1,
      FilterRules: [
        {
          field: "ProvinceCode",
          op: "=",
          value: code
        }
      ]
    }
    if(!this.compare.value){
      this.hotelService.getHotel(Paging).subscribe((res:any) => {
      this.length = res.TotalRecords;
      this.compare = res.DataList
      this.showHotel = this.compare.slice(0,this.pageSize);

      setTimeout(() => {
        this.loadingHotel = false
      },1000)
      })
    }
  }

  getHotelByProvince2(code) {
    this.loadingHotel = true;
    let Paging = {
      PageSize: 999999,
      PageIndex: 1,
      FilterRules: [
        {
          field: "ProvinceCode",
          op: "=",
          value: code
        }
      ]
    }
    if(!this.compare2.value){
      this.hotelService.getHotel(Paging).subscribe((res:any) => {
      this.length2 = res.TotalRecords;
      this.compare2 = res.DataList
      this.showHotel2 = this.compare2.slice(0,this.pageSize);

      setTimeout(() => {
        this.loadingHotel = false
      },1000)
      })
    }
  }

  getPage(e):any{
    let firstCut = e.pageIndex * e.pageSize;
    let secondCut = firstCut + e.pageSize;
    this.showHotel = this.compare.slice(firstCut,secondCut);
  }

  getPage2(e):any{
    let firstCut = e.pageIndex * e.pageSize;
    let secondCut = firstCut + e.pageSize;
    this.showHotel2 = this.compare2.slice(firstCut,secondCut);
  }

  FirstHotel(id) {
    let paging = {
      PageSize: 1,
      PageIndex: 1
    }
    this.hotelService.getHotelById(id,paging).subscribe((res:any) => {
      this.FirstHotelPick = true;
      let n = res.Data.ListRoom.length;
      for(let i = 0; i < n ; i++){
        let price = res.Data.ListRoom[i].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        res.Data.ListRoom[i].Price = price
      }
      this.FirstCompare = res.Data;

    })
  }

  SecondHotel(id) {
    let paging = {
      PageSize: 1,
      PageIndex: 1
    }
    this.hotelService.getHotelById(id,paging).subscribe((res:any) => {
      this.SecondHotelPick = true;
      let n = res.Data.ListRoom.length;
      for(let i = 0; i < n ; i++){
        let price = res.Data.ListRoom[i].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        res.Data.ListRoom[i].Price = price
      }
      this.SecondCompare = res.Data;
    })
  }

  removeFirstPick() {
    this.FirstHotelPick = false;
    this.FirstCompare = []
  }

  // Modal;
  FirstModal(): void {
    this.FirstVisible = true;
  }
  FirstCancel(): void {
    this.FirstVisible = false;
  }

  removeSecondPick() {
    this.SecondHotelPick = false;
    this.SecondCompare = []
  }

  // Modal;
  SecondModal(): void {
    this.SecondVisible = true;
  }
  SecondCancel(): void {
    this.SecondVisible = false;
  }

  get Content() {
    return this.fbForm.get('Content')
  }

  deleteCmt(id) {
    this.hotelService.deleteCmt(id).subscribe((res:any) => {
      this.nz.create('success', 'Thành công', 'Xóa đánh giá thành công', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      });
      this.getCmt();

    },error => {
      this.nz.create('error', 'Thất bại', 'Xóa đánh giá thất bại', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      });
    });

  }

  deleteConfirm(id): void {
    this.modalService.error({
      nzTitle : 'Xóa đánh giá ?',
      nzOkText: 'Xóa',
      nzCancelText: 'Hủy',
      nzOkType: 'danger',
      nzOnOk : () => this.deleteCmt(id)
    });
  }



  getCmt(){
    this.cmtPaging = {
      PageSize: 999,
      PageIndex: 1,
      FilterRules: [
        {
          field: "HotelId",
          op: "=",
          value: this.hotelId
        },
        {
          field: "Status",
          op: "=",
          value: 1
        }
      ]
    }
    this.hotelService.getCmt(this.cmtPaging).subscribe((res:any) => {
      this.cmt = res.DataList
    })
  }

  postCmt() {
    this.isLoading = true;
    this.hotelService.postCmt(this.fbForm.value).subscribe((res:any) => {
      this.nz.create('success', 'Thành công', 'Đánh giá thành công', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      });
      setTimeout(() => {
        this.isLoading = false;
        this.fbForm.get('Content').setValue('');
        this.getCmt();
      },1000)
    },error => {
      this.nz.create('error', 'Thất bại', 'Đánh giá thất bại', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      });
      console.log(error)
    })
  }

  selectRoom(id){
    let navigationExtras : NavigationExtras = {
      queryParams: {
        "location": this.location,
        "checkin": this.checkin,
        "checkout": this.checkout,
        "people": this.people,
        "day": this.day,
        "hotel": this.hotelId,
        "room": id
      }
    }
    this.router.navigate(['/thanh-toan'], navigationExtras);
  }


  ngAfterViewInit() {
  }

}
