import { Injectable } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type':  'application/json',
		'Accept': 'application/json',
		'Access-Controll-Allow-Origin': '*',
		'Access-Control-Allow-Credentials': 'true',
	})
}

const httpAuthOptions = {
	headers: new HttpHeaders({
		'Content-Type':  'application/json',
		'Accept': 'application/json',
		'Access-Controll-Allow-Origin': '*',
		'Access-Control-Allow-Credentials': 'true',
		'TokenCode': localStorage.getItem('tokenKey'),
	})
}

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private soriumUrl = 'https://luxuria-api.azurewebsites.net/API/';

  constructor(private http: HttpClient, private router: Router) { }

	login(formData) {
			return this.http.post(this.soriumUrl + `Acc/Login`, formData, httpOptions)
	}

	logout() {
			localStorage.removeItem('tokenKey');
			sessionStorage.removeItem('id');
			this.router.navigate(['/dang-nhap']);
	}

	signup(formData) {
		return this.http.post(this.soriumUrl + 'Acc/Register', formData, httpOptions)
	}

	getUser(token) {
		return this.http.get(this.soriumUrl + 'ACC/GET/' + token, httpAuthOptions)
	}

	ownerSignup(formData) {
		return this.http.post(this.soriumUrl + 'Hotel/RegisterHotel', formData, httpAuthOptions)
	}

	resendOtp(formData) {
		return this.http.post(this.soriumUrl + 'ACC/ResendOTP', formData, httpOptions)
	}

	forgotPw(formData) {
		return this.http.post(this.soriumUrl + 'ACC/ForgetPassword', formData, httpOptions)
	}

}
