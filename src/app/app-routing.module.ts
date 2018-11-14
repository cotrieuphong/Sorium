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
import { UserGuard } from './_guards/user.guard';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'result', component: ResultComponent
  },
  {
    path: 'dang-nhap', component: SigninComponent
  },
  {
    path: 'dang-ky', component: SignupComponent
  },
  {
    path: 'ho-so',
    component: ProfileComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'chi-tiet', component: DetailComponent
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
