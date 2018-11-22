import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { GalleryItem, ImageItem, GalleryConfig, ThumbnailsPosition } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
import { HotelService } from '../_services/hotel.service';
import { Observable } from 'rxjs';
import Masonry from 'masonry-layout';
import ImagesLoaded from 'imagesLoaded';
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
  imagesLoaded = ImagesLoaded;
  hotel = [
    {
      id: 1,
      name: "Khách sạn Helios Legend",
      location: "Phố cổ, Hà Nội",
      star: 3.5,
      about: `Hotel Alfa Kyoto, tọa lạc tại khu vực Nam Kyoto, Kyoto, là lựa chọn nổi tiếng dành cho khách du lịch. Chỉ cách sân bay 30.6 km, nên từ sân bay rất dễ để đi đến khách sạn 3 sao này. Với vị trí thuận lợi, khách sạn dễ dàng tiếp cận những điểm tham quan du lịch nổi tiếng của thành phố.
      <br><br>
      Tại Hotel Alfa Kyoto, dịch vụ hoàn hảo và thiết bị tối tân tạo nên một kì nghỉ khó quên. Sự chọn lọc khắt khe những thiết bị hàng đầu như dịch vụ phòng 24 giờ, miễn phí wifi tất cả các phòng, dịch vụ phòng hàng ngày, dịch vụ taxi, quầy lễ tân 24 giờ để khách có thể tận hưởng thoải mái khi ở khách sạn.
      <br><br>
      Tất cả nơi ăn chốn ở của khách đều có trang bị tiện nghi chu đáo để bảo đảm khách có cảm giác dễ chịu không nơi nào sánh được. Bên cạnh đó, khách sạn còn gợi ý cho bạn những hoạt động vui chơi giải trí bảo đảm bạn luôn thấy hứng thú trong suốt kì nghỉ. Với vị trí lý tưởng và cơ sở vật chất thích hợp, Hotel Alfa Kyoto đạt được tiêu chuẩn ở mọi khía cạnh.`,
      images: [
        {
          src: '../../assets/img/nha-trang.jpg',
          thumb: '../../assets/img/nha-trang.jpg'
        },
        {
          src: '../../assets/img/ha-noi.jpg',
          thumb: '../../assets/img/ha-noi.jpg'
        },
        {
          src: '../../assets/img/da-nang.jpg',
          thumb: '../../assets/img/da-nang.jpg'
        },
        {
          src: '../../assets/img/ho-chi-minh.jpg',
          thumb: '../../assets/img/ho-chi-minh.jpg'
        },
        {
          src: '../../assets/img/hotel-1.jpg',
          thumb: '../../assets/img/hotel-1.jpg'
        },
        {
          src: '../../assets/img/hotel-2.jpg',
          thumb: '../../assets/img/hotel-1.jpg'
        },
        {
          src: '../../assets/img/nha-trang.jpg',
          thumb: '../../assets/img/nha-trang.jpg'
        },
        {
          src: '../../assets/img/ha-noi.jpg',
          thumb: '../../assets/img/ha-noi.jpg'
        },
        {
          src: '../../assets/img/da-nang.jpg',
          thumb: '../../assets/img/da-nang.jpg'
        },
        {
          src: '../../assets/img/ho-chi-minh.jpg',
          thumb: '../../assets/img/ho-chi-minh.jpg'
        },
        {
          src: '../../assets/img/hotel-1.jpg',
          thumb: '../../assets/img/hotel-1.jpg'
        },
        {
          src: '../../assets/img/hotel-2.jpg',
          thumb: '../../assets/img/hotel-1.jpg'
        }
      ],
      services: [
        {
          icon: "fa-wifi",
          description: "Wifi miễn phí ở mọi phòng"
        },
        {
          icon: "fa-cocktail",
          description: "Có quầy bar"
        },
        {
          icon: "fa-swimming-pool",
          description: "Có bể bơi"
        },
        {
          icon: "fa-snowflake",
          description: "Có điều hòa"
        }
      ],
      rooms: [
        {
          id: 1,
          name: "Phòng tiêu chuẩn",
          image: "../../assets/img/ha-noi.jpg",
          area: 22,
          price: "2.400.000",
          info: [
            {
              icon: "fa-user-friends",
              description: "Tối đa 2 người"
            },
            {
              icon: "fa-bed",
              description: "Có 1 giường đôi"
            },
            {
              icon: "fa-shower",
              description: "Phòng tắm có vòi sen"
            }
          ]
        },
        {
          id: 2,
          name: "Phòng tiêu chuẩn 2 giường đơn",
          image: "../../assets/img/hotel-2.jpg",
          area: 22,
          price: "3.400.000",
          info: [
            {
              icon: "fa-user-friends",
              description: "Tối đa 2 người"
            },
            {
              icon: "fa-bed",
              description: "Có 2 giường đơn"
            },
            {
              icon: "fa-shower",
              description: "Phòng tắm có vòi sen"
            }
          ]
        },
        {
          id: 3,
          name: "Phòng Deluxe",
          image: "../../assets/img/ho-chi-minh.jpg",
          area: 22,
          price: "4.400.000",
          info: [
            {
              icon: "fa-user-friends",
              description: "Tối đa 4 người"
            },
            {
              icon: "fa-bed",
              description: "Có 2 giường đôi"
            },
            {
              icon: "fa-bath",
              description: "Có bồn tắm và hoa sen"
            }
          ]
        }
      ]
    }
  ]
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
  // hotel = [
  //   {
  //     id: 1,
  //     name: "Khách sạn Helios Legend",
  //     thumbnail: "",
  //
  //   }
  // ]
  constructor(
    private hotelService: HotelService) { }

  ngOnInit() {

    $(function(){
      $('.sticky-search-wrapper').remove();
      $('.ant-anchor-link-title').data("title", $('.ant-anchor-link-title').attr("title")).removeAttr("title");

    })
  }

  ngAfterViewInit() {
    const grid = document.querySelector('.hg-content');
    this.imagesLoaded(grid, function(){
      const msnry = new Masonry(grid, {
        itemSelector: '.hg-item',
        gutter: 10,
        percentPosition: true,
        horizontalOrder: true,
      })

    })
  }

}
