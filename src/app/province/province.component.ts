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

  allProvince;

  constructor(private provinceService: ProvinceService) { }

  ngOnInit() {

    this.provinceService.getProvince().subscribe((res: any) => {
      this.allProvince = res.DataList;
      console.log(res);
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
