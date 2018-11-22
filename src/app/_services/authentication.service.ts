import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {

  private soriumUrl = 'https://luxuria-api.azurewebsites.net/API/';

  constructor(private http: HttpClient, private router: Router) { }

  login(formData) {
      return this.http.post<any>(this.soriumUrl + `Acc/Login`, formData)
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('tokenKey');
      this.router.navigate(['/dang-nhap']);
  }
}
