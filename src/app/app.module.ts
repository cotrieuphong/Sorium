import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { UserGuard } from './_guards/user.guard';
import { AuthenticationService } from './_services/authentication.service';
import { UserService } from './_services/user.service';
import { HotelService } from './_services/hotel.service';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material';
import { NgZorroAntdModule, NZ_I18N, en_US} from 'ng-zorro-antd';
import { setTheme } from 'ngx-bootstrap/utils';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgMasonryGridModule } from 'ng-masonry-grid';
import { GalleryModule } from  '@ngx-gallery/core';
import { LightboxModule } from  '@ngx-gallery/lightbox';
import { GallerizeModule } from  '@ngx-gallery/gallerize';
import { HomeComponent } from './home/home.component';
import { ResultComponent } from './result/result.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { DetailComponent } from './detail/detail.component';
import { ErrorComponent } from './error/error.component';
import en from '@angular/common/locales/en';
import { OwnerComponent } from './owner/owner.component';
import { PaymentComponent } from './payment/payment.component';
import { ProvinceComponent } from './province/province.component';
import { ProvinceDetailComponent } from './province/province-detail/province-detail.component';
import { SignupConfirmComponent } from './signup/signup-confirm/signup-confirm.component';
import { ForgotPwComponent } from './signin/forgot-pw/forgot-pw.component';
import { OwnerConfirmComponent } from './owner/owner-confirm/owner-confirm.component';
import { ForgotFormComponent } from './signin/forgot-form/forgot-form.component';
import { PolicyComponent } from './common/policy/policy.component';
import { TermComponent } from './common/term/term.component';
import { QuestionComponent } from './common/question/question.component';
import { JobComponent } from './common/job/job.component';
import { ContactComponent } from './common/contact/contact.component';
import { PartnerComponent } from './common/partner/partner.component';
import { PaymentConfirmComponent } from './payment/payment-confirm/payment-confirm.component';
import {MAT_DATE_LOCALE} from '@angular/material/core';
registerLocaleData(en);
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ResultComponent,
    HeaderComponent,
    FooterComponent,
    SigninComponent,
    SignupComponent,
    ProfileComponent,
    DetailComponent,
    ErrorComponent,
    OwnerComponent,
    PaymentComponent,
    ProvinceComponent,
    ProvinceDetailComponent,
    SignupConfirmComponent,
    ForgotPwComponent,
    OwnerConfirmComponent,
    ForgotFormComponent,
    PolicyComponent,
    TermComponent,
    QuestionComponent,
    JobComponent,
    ContactComponent,
    PartnerComponent,
    PaymentConfirmComponent,

  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SlickCarouselModule,
    MaterialModule,
    FormsModule,
    NgMasonryGridModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    NgZorroAntdModule,
    FontAwesomeModule,
    GalleryModule.forRoot({thumb: false}),
    LightboxModule.forRoot({panelClass: "fullscreen"}),
    GallerizeModule
  ],
  entryComponents: [
  ],
  providers: [
    UserGuard,
    AuthenticationService,
    UserService,
    HotelService,
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: NZ_I18N, useValue: en_US },
    {provide: MAT_DATE_LOCALE, useValue: 'vi-VI'},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
   setTheme('bs4');
 }
}
