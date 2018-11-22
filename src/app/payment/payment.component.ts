import { Component, ViewEncapsulation, OnInit, AfterViewInit} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import {map, startWith, debounceTime, tap, finalize} from 'rxjs/operators';
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
  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.firstForm = this.fb.group({
      name: ['', [
        Validators.required
      ]],
      phone: ['', [
        Validators.required
      ]],
      email: ['', [
        Validators.required
      ]]
    })
    this.secondForm = this.fb.group({
      credit: ['', [
        Validators.required
      ]],
      creditName: ['', [
        Validators.required
      ]]
    })
    $(function(){
      $('.sticky-search-wrapper').remove();
    })
  }

  get name() {
    return this.firstForm.get('name')
  }

  get address() {
    return this.secondForm.get('address')
  }

}
