import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const SUB_URL= "/brand";

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http:HttpClient) { }

  getAllBrand(status:string,limit:number,offset:number): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl+  SUB_URL, {headers, params: { offset: offset, limit: limit, type: status}});
  }

  getAllActiveBrand(status:string): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl + SUB_URL, {headers, params: { type:status }});
  }

  getCount(value:string): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl + SUB_URL + "/get-count", {headers, params: { value: value, type: 'ALL' }});
  }

  changeStatus(id:string,status:string): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl + SUB_URL + "/change-status/" + id + "/" + status, {headers});
  }
  
  saveBrand(category:any): Observable<any> {
    console.log(category)
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.post<any>(environment.baseUrl + SUB_URL, category, {headers});
  }

  getBrand(id:string): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl + SUB_URL + "/" + id, {headers});
  }
}
