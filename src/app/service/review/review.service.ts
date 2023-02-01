import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const SUB_URL= "/review";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {


  constructor(private http:HttpClient) { }

  getAllReviews(status:string,limit:number,offset:number): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl+  SUB_URL, {headers, params: { offset: offset, limit: limit, type:status }});
  }

  getCount(value:string): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl + SUB_URL + "/get-count", {headers, params: { value: value, type: 'ACTIVE' }});
  }

  changeStatus(id:string,status:string): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl + SUB_URL + "/change-status/" + id + "/" + status, {headers});
  }



}
