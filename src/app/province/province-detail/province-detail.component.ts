import { Component, ViewEncapsulation, OnInit, AfterViewInit} from '@angular/core';
import { HotelService } from '../../_services/hotel.service';
import { ProvinceService } from '../../_services/province.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-province-detail',
  templateUrl: './province-detail.component.html',
  styleUrls: ['./province-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProvinceDetailComponent implements OnInit {
  masonryOpt = {
    itemSelector: '.search-item',
    gutter: 16,
    horizontalOrder: true,
    resize: true,
    stagger: 30
  }
  provinceId;
  hotelPaging;
  hotels;
  provinceName;
  services;
  tags;
  price;
  loadingScreen = true;
  public location: string;
  public checkin: string;
  public checkout: string;
  public people: number;
  public day: number;
  constructor(
    private activatedRoute : ActivatedRoute,
    private hotelService : HotelService,
    private provinceService : ProvinceService,
  ) {
    this.activatedRoute.params.subscribe(params => this.provinceId = params.id)
  }

  ngOnInit() {
    this.provinceService.getProvinceById(this.provinceId).subscribe((res:any) => {
      this.provinceName = res.Data.ProvinceName;
      this.hotelPaging = {
        PageSize: 999999,
        PageIndex: 1,
        FilterRules: [
          {
            field: "ProvinceCode",
            op: "=",
            value: res.Data.ProvinceCode
          }
        ]
      };
      this.hotelService.getHotel(this.hotelPaging).subscribe(async(res:any) => {

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
          $('.trigger').click(function(){
            $(this).toggleClass('show');
            $(this).parent().find('.info').toggleClass('show')
          })
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
            })

            $('.prevent-input').keypress(function(e) {
              e.preventDefault();
            });
          })
        })
      })
    })
  }

}
