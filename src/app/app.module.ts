import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { UserGuard } from './_guards/user.guard';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor'
import { AuthenticationService } from './_services/authentication.service';
import { UserService } from './_services/user.service';

import { AppComponent } from './app.component';
// import { SlickCarouselModule } from 'ngx-slick-carousel';
import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material';
import { NgZorroAntdModule, NZ_I18N, en_US} from 'ng-zorro-antd';
import { setTheme } from 'ngx-bootstrap/utils';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RatingModule } from 'ngx-bootstrap/rating';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // SlickCarouselModule,
    MaterialModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    RatingModule.forRoot(),
    ReactiveFormsModule,
    IonRangeSliderModule,
    NgZorroAntdModule,
    FontAwesomeModule
  ],
  entryComponents: [
  ],
  providers: [
    UserGuard,
    AuthenticationService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
   setTheme('bs4');
 }
}
