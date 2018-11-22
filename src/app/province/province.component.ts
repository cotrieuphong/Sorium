import { Component, ViewEncapsulation, OnInit, AfterViewInit} from '@angular/core';
import { ProvinceService } from '../_services/province.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProvinceComponent implements OnInit {

  constructor(private provinceService: ProvinceService) { }

  ngOnInit() {
    this.provinceService.getProvince().subscribe((res: any) => {
      // let rand = res.DataList[Math.floor(Math.random() * res.DataList.length)];
      // console.log(rand)
      this.getRandom(res.DataList, 5);
    })
  }
  getRandom(arr, count) {

    let shuffled = arr.sort(function() {
      return .5 - Math.random()
    });
    let selected = shuffled.slice(0,count);
    return console.log(selected);
  }
}
