import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { GalleryItem, ImageItem, GalleryConfig, ThumbnailsPosition } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
import { HotelService } from '../_services/hotel.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Masonry, MasonryGridItem } from 'ng-masonry-grid'
import { map } from 'rxjs/operators';
import * as $ from 'jquery';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailComponent implements OnInit {
  images: GalleryItem[];
  masonryOpt = {
    itemSelector: '.hg-item',
    gutter: 10,
    horizontalOrder: true,
    stagger: 30,
    percentPosition: true
  }
  hotel: any = [];
  hotelId;
  paging;
  curency;
  services;
  navigationExtra: NavigationExtras;
  public location: string;
  public checkin: string;
  public checkout: string;
  public people: number;
  public day: number;
  heroConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "asNavFor": '.nav-carousel',
    "draggable": false
  };
  navConfig = {
    "slidesToShow": 5,
    "slidesToScroll": 1,
    "asNavFor": '.hero-carousel',
    "centerMode": true,
    "focusOnSelect": true,
    "autoplay": true,
    "infinite": true,
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
  loadingScreen = true;
  constructor(
    private hotelService: HotelService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
      this.activatedRoute.queryParams.subscribe(params => {
        this.location = null ? "" : params["location"];
        this.people = params["people"];
        this.checkin = null ? "" : params["checkin"];
        this.checkout = null ? "" : params["checkout"];
        this.day = null ? "" : params["day"];
        this.hotelId = params["hotel"];
      });
    }

  ngOnInit() {

    this.paging = {
      PageSize: 999,
      PageIndex: 1
    }
    this.hotelService.getHotelById(this.hotelId, this.paging).subscribe(async(res:any) => {
      let n = res.Data.ListRoom.length;
      for(let i = 0; i < n ; i++){
        this.curency = res.Data.ListRoom[i].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        res.Data.ListRoom[i].Price = this.curency
      }
      this.services = JSON.parse(res.Data.Services);
      res.Data.Services = this.services;
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
    console.log(this.day)
    this.router.navigate(['/thanh-toan'], navigationExtras);
  }


  ngAfterViewInit() {
  }

}
