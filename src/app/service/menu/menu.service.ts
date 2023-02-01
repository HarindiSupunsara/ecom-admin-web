import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const SUB_URL= "/menu";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http:HttpClient) { }

  getAllMenus(status:string,limit:number,offset:number): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl+ SUB_URL, {headers, params: { offset: offset, limit: limit, type:status }});
  }

  getAllActiveMenus(status:string): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl + SUB_URL, {headers, params: { type:status }});
  }

  getCount(value:string): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl + SUB_URL + "/get-count", {headers, params: { value: value, type: 'ALL' }});
  }

  changeStatus(id:number,status:number): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl + SUB_URL + "/change-status/" + id + "/" + status, {headers});
  }
  
  saveMenu(instrument:any): Observable<any> {
    console.log(instrument)
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.post<any>(environment.baseUrl + SUB_URL, instrument, {headers});
  }

  getMenu(id:string): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl + SUB_URL + "/" + id, {headers});
  }
}
