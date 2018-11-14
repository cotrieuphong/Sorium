import { Injectable } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
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
export class DataService {

  private soriumUrl = 'https://luxuria-api.azurewebsites.net/API/';

  constructor(private http: HttpClient) { }

  getProvinces() {
    return this.http.get('https://luxuria-api.azurewebsites.net/api/province/getprovince')
  }

  signinService (formData): Observable<any> {

    return this.http.post(this.soriumUrl + 'Acc/Login', formData, httpOptions)

  }

  signupService (formData): Observable<any> {

    return this.http.post(this.soriumUrl + 'Acc/Register', formData, httpOptions)

  }


}
