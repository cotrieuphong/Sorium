import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailComponent implements OnInit {

  primary = 'rgba(#3f51b5,.3)';
  constructor() { }

  ngOnInit() {
    $(function(){
      $('.sticky-search-wrapper').remove();
      $('.ant-anchor-link-title').data("title", $('.ant-anchor-link-title').attr("title")).removeAttr("title");
    })
  }

}
