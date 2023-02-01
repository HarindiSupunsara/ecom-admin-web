import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const SUB_URL= "/order_details";

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {

  constructor(private http:HttpClient) { }

  getAllOrders(status:string,limit:number,offset:number,order_stage:any): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl+ SUB_URL, {headers, params: { offset: offset, limit: limit, type:status , order_stage:order_stage}});
  }

  getCount(value:string): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl + SUB_URL + "/get-count", {headers, params: {type: "ALL" , value: value }});
  }

  getOrder(id:any): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl + SUB_URL + "/"+id, {headers});
  }

  changeOrderStage(id:any,stage:string): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl + SUB_URL + "/change-stage/"+id+"/"+stage, {headers});
  }
}
