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
import { OwnerConfirmComponent } from './owner/owner-confirm/owner-confirm.component';
import { ForgotFormComponent } from './signin/forgot-form/forgot-form.component';
import { PolicyComponent } from './common/policy/policy.component';
import { TermComponent } from './common/term/term.component';
import { QuestionComponent } from './common/question/question.component';
import { JobComponent } from './common/job/job.component';
import { ContactComponent } from './common/contact/contact.component';
import { PartnerComponent } from './common/partner/partner.component';
import { PaymentConfirmComponent } from './payment/payment-confirm/payment-confirm.component';
const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'ket-qua', component: ResultComponent
  },
  {
    path: 'dang-nhap', component: SigninComponent,
  },
  {
    path: 'quen-mat-khau', component: ForgotPwComponent
  },
  {
    path: 'doi-mat-khau', component: ForgotFormComponent
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
    path: 'xac-nhan-chu-khach-san',
    component: OwnerConfirmComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'thanh-toan',
    component: PaymentComponent
  },
  {
    path: 'xac-nhan-dat-phong',
    component: PaymentConfirmComponent
  },
  {
    path: 'chi-tiet', component: DetailComponent
  },
  {
    path: 'tinh-thanh', component: ProvinceComponent
  },
  {
    path: 'tinh-thanh/chi-tiet/:id', component: ProvinceDetailComponent
  },
  {
    path: 'cau-hoi', component: QuestionComponent
  },
  {
    path: 'chinh-sach', component: PolicyComponent
  },
  {
    path: 'dieu-khoan', component: TermComponent
  },
  {
    path: 'tuyen-dung', component: JobComponent
  },
  {
    path: 'lien-he', component: ContactComponent
  },
  {
    path: 'doi-tac', component: PartnerComponent
  },
  {
    path: '**', component: ErrorComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      useHash: true
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
