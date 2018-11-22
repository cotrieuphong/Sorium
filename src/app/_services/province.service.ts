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
export class ProvinceService {

  private soriumUrl = 'https://luxuria-api.azurewebsites.net/API/';

  constructor(private http: HttpClient) { }

  getProvince(){
    return this.http.get(this.soriumUrl + 'province/getprovince')
  }

	getDistrict(data){
		return this.http.post(this.soriumUrl + "District/GetPaging", data)
	}

}
