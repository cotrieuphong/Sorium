import { Injectable } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../_models/user';

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

  constructor(private http: HttpClient) { }

  signup (user: User): Observable<any> {

    return this.http.post(this.soriumUrl + 'Acc/Register', user, httpOptions)

  }

}
