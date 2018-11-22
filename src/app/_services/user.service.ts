import { Injectable } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../_models/user';

const httpAuthOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json; charset=utf-8',
		'TokenCode': localStorage.getItem('tokenKey'),
	})
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private soriumUrl = 'https://luxuria-api.azurewebsites.net/API/';

  constructor(private http: HttpClient) { }

  signup(user) {
    return this.http.post(this.soriumUrl + 'Acc/Register', user)

  }

	ownerSignup(formData){
		return this.http.post(this.soriumUrl + 'Hotel/RegisterHotel', formData, httpAuthOptions)
	}

}
