import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ResultComponent } from './result/result.component';
import { HeaderComponent } from './header/header.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { FooterComponent } from './footer/footer.component';
import { DetailComponent } from './detail/detail.component';
import { ErrorComponent } from './error/error.component';
import { OwnerComponent } from './owner/owner.component';
import { PaymentComponent } from './payment/payment.component';
import { UserGuard } from './_guards/user.guard';
import { ProvinceComponent } from './province/province.component';
import { ProvinceDetailComponent } from './province/province-detail/province-detail.component';
import { SignupConfirmComponent } from './signup/signup-confirm/signup-confirm.component';
import { ForgotPwComponent } from './signin/forgot-pw/forgot-pw.component';
const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'ket-qua', component: ResultComponent
  },
  {
    path: 'ket-qua/:kq', component: ResultComponent
  },
  {
    path: 'dang-nhap', component: SigninComponent,
  },
  {
    path: 'quen-mat-khau', component: ForgotPwComponent
  },
  {
    path: 'dang-ky', component: SignupComponent,
  },
  {
    path: 'xac-nhan', component: SignupConfirmComponent
  },
  {
    path: 'ho-so',
    component: ProfileComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'chu-khach-san',
    component: OwnerComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'thanh-toan', component: PaymentComponent
  },
  {
    path: 'chi-tiet', component: DetailComponent
  },
  {
    path: 'tinh-thanh', component: ProvinceComponent
  },
  {
    path: '**', component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
