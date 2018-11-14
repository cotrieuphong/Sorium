import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit{

  constructor() {
  }

  ngOnInit() {
    $(function(){
      $('.login-btn, .res-btn, .sticky-search-wrapper').hide();
    })
  }


}
