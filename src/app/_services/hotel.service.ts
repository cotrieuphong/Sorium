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

const httpAuth = (token) => {
	if(!token){
		return new HttpHeaders({'Content-Type':  'application/json'})
	}
	return new HttpHeaders({
		'Content-Type':  'application/json',
		'TokenCode': localStorage.getItem('tokenKey')})
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
export class HotelService {

  private soriumUrl = 'https://luxuria-api.azurewebsites.net/API/';

  constructor(private http: HttpClient) { }


	getHotel(searchData) {
		return this.http.post(this.soriumUrl + 'Hotel/GetPaging ',searchData, httpOptions)
	}

	getHotelById(id, formData){
		return this.http.post(this.soriumUrl + 'Hotel/GetItemByClient/'+id, formData, httpOptions)
	}

	getRoomById(id) {
		return this.http.get(this.soriumUrl + 'Room/GetDetail/' + id, httpOptions)
	}

	sendOrder(formData) {
		return this.http.post(this.soriumUrl + 'Order/Insert', formData, httpOptions)
	}

	getTop3() {
		return this.http.get(this.soriumUrl + 'Comment/GetTop3', httpOptions)
	}

	getCmt(formData) {
		return this.http.post(this.soriumUrl + 'Comment/GetPaging', formData, httpOptions)
	}

	postCmt(formData) {
		return this.http.post(this.soriumUrl + 'Comment/Post', formData, httpAuthOptions)
	}

	deleteCmt(id) {
		return this.http.delete(this.soriumUrl + 'Comment/Delete?Id=' + id, httpAuthOptions)
	}

}
