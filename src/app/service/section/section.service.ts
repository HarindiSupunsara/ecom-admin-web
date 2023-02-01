import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const SUB_URL = "/section"

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  constructor(private http:HttpClient) { }

  getAllSection(status:string,limit:number,offset:number): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl+  SUB_URL, {headers, params: { offset: offset, limit: limit, type: status}});
  }

  getAllActiveSection(status:string): Observable<any> {
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
  
  saveSection(category:any): Observable<any> {
    console.log(category)
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.post<any>(environment.baseUrl + SUB_URL, category, {headers});
  }

  getSection(id:string): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl + SUB_URL + "/" + id, {headers});
  }

  getAllLayouts(status:string): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl+  SUB_URL + "/all-layout", {headers, params: { type: status}});
  }
}
