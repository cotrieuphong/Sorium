import { Component, ViewEncapsulation, OnInit, AfterViewInit} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { HotelService } from '../_services/hotel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import {map, startWith, debounceTime} from 'rxjs/operators';
import * as $ from 'jquery';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentComponent implements OnInit {
  firstForm: FormGroup;
  secondForm: FormGroup;
  isCompleted = false;
  roomId;
  room;
  paging;
  Hotel;
  money;
  order;
  public location: string;
  public checkin;
  public checkout;
  public people: number;
  public day: number;
  public hotel: number;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private hotelService: HotelService,
    private activatedRoute: ActivatedRoute,
    private nz: NzNotificationService) {
      this.activatedRoute.queryParams.subscribe(params => {
        this.location = null ? "" : params["location"];
        this.people = params["people"];
        this.checkin = null ? "" : params["checkin"];
        this.checkout = null ? "" : params["checkout"];
        this.day = null ? "" : params["day"];
        this.hotel = params["hotel"];
        this.roomId = params["room"];
      });
    }

  ngOnInit() {
    this.firstForm = this.fb.group({
      GuestName: ['', [
        Validators.required
      ]],
      GuestPhoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^-?(0|[0-9]\d*)?$/),
        Validators.minLength(9),
        Validators.maxLength(10)
      ]],
      GuestEmail: ['', [
        Validators.required,
        Validators.email
      ]],
      RoomId: '',
      RoomName: '',
      Checkin: '',
      Checkout: '',
      Price: '',
      isPaid: 0,
      PNum: '',
      Description: ''
    })

    this.hotelService.getRoomById(this.roomId).subscribe((res:any) => {
      this.room = res.Data;
      this.money = (res.Data.Price * this.day).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    })
    this.paging = {
      PageSize: 999,
      PageIndex: 1
    }

    this.hotelService.getHotelById(this.hotel, this.paging).subscribe((res:any) => {
      this.Hotel = res.Data;
    })

    // this.secondForm = this.fb.group({
    //   credit: ['', [
    //     Validators.required
    //   ]],
    //   creditName: ['', [
    //     Validators.required
    //   ]]
    // })

    $(function(){
      $('.sticky-search-wrapper').remove();
    })
  }

  get GuestName() {
    return this.firstForm.get('GuestName')
  }

  get GuestPhoneNumber() {
    return this.firstForm.get('GuestPhoneNumber')
  }

  get GuestEmail() {
    return this.firstForm.get('GuestEmail')
  }

  onSubmit() {
    this.firstForm.get('RoomId').setValue(this.room.Id);
    this.firstForm.get('RoomName').setValue(this.room.Name);
    this.firstForm.get('Checkin').setValue(this.checkin);
    this.firstForm.get('Checkout').setValue(this.checkout);
    this.firstForm.get('Price').setValue(this.room.Price);
    this.firstForm.get('PNum').setValue(this.people);
    let formData = {
      Order: '',
      SucUrl: 'https://takajourei.github.io/Sorium/#/login',
      FailUrl: window.location.href
    }
    formData.Order = this.firstForm.value;
    console.log(formData);
    this.hotelService.sendOrder(formData).subscribe(res => {
      console.log()
      this.nz.create('success', 'Thành công', 'Vui lòng check email của bạn', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      });
      this.isCompleted = true;
    },
    error => {
      this.nz.create('error', 'Lỗi', 'Đặt phòng không thành công', {
        nzDuration: 2500,
        nzAnimate: true,
        nzPauseOnHover: true
      });
    }
  )
  }
}
