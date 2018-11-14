import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import Masonry from 'masonry-layout';
import ImagesLoaded from 'imagesLoaded';
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResultComponent implements OnInit {

  imagesLoaded = ImagesLoaded;
  hotels = [
    {
      id: 1,
      name: 'Khách sạn Helios Legend',
      location: 'Phố cổ hà nội',
      thumbnail:'../../assets/img/ha-noi.jpg',
      about: `Cho dù bạn là khách du lịch hay đi công tác, Helios Legend Hotel là sự lựa chọn tuyệt vời để nghỉ lại khi đến thành phố Hà Nội. Cách sự nhộn nhịp của thành phố 0 KM, khách sạn 3.5 sao này có vị trí vô cùng thuận lợi và dễ tiếp cận các địa điểm lớn của thành phố này. Với vị trí thuận lợi, khách sạn dễ dàng tiếp cận những điểm tham quan du lịch nổi tiếng của thành phố.
      Cho dù bạn là khách du lịch hay đi công tác, Helios Legend Hotel là sự lựa chọn tuyệt vời để nghỉ lại khi đến thành phố Hà Nội. Cách sự nhộn nhịp của thành phố 0 KM, khách sạn 3.5 sao này có vị trí vô cùng thuận lợi và dễ tiếp cận các địa điểm lớn của thành phố này. Với vị trí thuận lợi, khách sạn dễ dàng tiếp cận những điểm tham quan du lịch nổi tiếng của thành phố.`,
      star: 3,
      minPrice: '890.000 đ',
      tagIcons: [
        {
          iconName: 'fa-wifi',
          description: 'Wifi miễn phí'
        },
        {
          iconName: 'fa-hot-tub',
          description: 'Có phòng tắm'
        },
        {
          iconName: 'fa-smoking-ban',
          description: 'Không hút thuốc'
        },
        {
          iconName: 'fa-utensils',
          description: 'Có căng tin'
        },
        {
          iconName: 'fa-snowflake',
          description: 'Có điều hòa'
        }
      ],
      tagTexts: [
        {
          text: 'Ăn sáng miễn phí',
          color: 'green'
        },
        {
          text: 'Thanh toán tại nơi ở',
          color: 'orange'
        },
        {
          text: 'Mới xây dựng',
          color: 'primary'
        },
        {
          text: 'Đang hot',
          color: 'red'
        }
      ]
    },
    {
      id: 2,
      name: 'Khách sạn & Spa Santana Felix',
      location: 'Phố cổ hà nội',
      thumbnail:'../../assets/img/ho-chi-minh.jpg',
      about: `Cho dù bạn là khách du lịch hay đi công tác, Helios Legend Hotel là sự lựa chọn tuyệt vời để nghỉ lại khi đến thành phố Hà Nội. Cách sự nhộn nhịp của thành phố 0 KM, khách sạn 3.5 sao này có vị trí vô cùng thuận lợi và dễ tiếp cận các địa điểm lớn của thành phố này. Với vị trí thuận lợi, khách sạn dễ dàng tiếp cận những điểm tham quan du lịch nổi tiếng của thành phố.`,
      star: 3.5,
      minPrice: '1.290.000 đ',
      tagIcons: [
        {
          iconName: 'fa-wifi',
          description: 'Wifi miễn phí'
        },
        {
          iconName: 'fa-hot-tub',
          description: 'Có phòng tắm'
        },
        {
          iconName: 'fa-smoking-ban',
          description: 'Không hút thuốc'
        },
        {
          iconName: 'fa-utensils',
          description: 'Có căng tin'
        },
        {
          iconName: 'fa-snowflake',
          description: 'Có điều hòa'
        }
      ],
      tagTexts: [
        {
          text: 'Ăn sáng miễn phí',
          color: 'green'
        },
        {
          text: 'Thanh toán tại nơi ở',
          color: 'orange'
        },
        {
          text: 'Đang hot',
          color: 'red'
        }
      ]
    },
    {
      id: 3,
      name: 'Mongola Hotel Spa',
      location: 'Phố cổ hà nội',
      thumbnail:'../../assets/img/da-nang.jpg',
      about: `Cho dù bạn là khách du lịch hay đi công tác, Helios Legend Hotel là sự lựa chọn tuyệt vời để nghỉ lại khi đến thành phố Hà Nội.`,
      star: 2.5,
      minPrice: '490.000 đ',
      tagIcons: [
        {
          iconName: 'fa-wifi',
          description: 'Wifi miễn phí'
        },
        {
          iconName: 'fa-hot-tub',
          description: 'Có phòng tắm'
        },
        {
          iconName: 'fa-smoking-ban',
          description: 'Không hút thuốc'
        },
        {
          iconName: 'fa-utensils',
          description: 'Có căng tin'
        },
        {
          iconName: 'fa-snowflake',
          description: 'Có điều hòa'
        }
      ],
      tagTexts: [
        {
          text: 'Ăn sáng miễn phí',
          color: 'green'
        },
        {
          text: 'Thanh toán tại nơi ở',
          color: 'orange'
        },
        {
          text: 'Đang hot',
          color: 'red'
        }
      ]
    },
    {
      id: 4,
      name: 'Mongola Hotel Spa',
      location: 'Phố cổ hà nội',
      thumbnail:'../../assets/img/nha-trang.jpg',
      about: `Cho dù bạn là khách du lịch hay đi công tác, Helios Legend Hotel là sự lựa chọn tuyệt vời để nghỉ lại khi đến thành phố Hà Nội.`,
      star: 4.5,
      minPrice: '2.490.000 đ',
      tagIcons: [
        {
          iconName: 'fa-wifi',
          description: 'Wifi miễn phí'
        },
        {
          iconName: 'fa-hot-tub',
          description: 'Có phòng tắm'
        },
        {
          iconName: 'fa-smoking-ban',
          description: 'Không hút thuốc'
        },
        {
          iconName: 'fa-utensils',
          description: 'Có căng tin'
        },
        {
          iconName: 'fa-snowflake',
          description: 'Có điều hòa'
        }
      ],
      tagTexts: [
        {
          text: 'Ăn sáng miễn phí',
          color: 'green'
        },
        {
          text: 'Thanh toán tại nơi ở',
          color: 'orange'
        },
        {
          text: 'Đang hot',
          color: 'red'
        }
      ]
    }
  ]

  constructor() { }

  ngOnInit() {
    console.log(this.hotels);
    const grid = document.querySelector('.search-result');
    this.imagesLoaded(grid, function(){
      const msnry = new Masonry(grid, {
        itemSelector: '.search-item',
        gutter: 16,
        percentPosition: true,
        horizontalOrder: true,
      })

    })

    $(function(){
      $('.trigger').click(function(){
        $(this).toggleClass('show');
        $(this).parent().find('.info').toggleClass('show')
      })
    })
  }

  ngAfterViewInit() {

  }

}
