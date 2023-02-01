import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const SUB_URL= "/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 
  constructor(private http:HttpClient) { }

  getAllProduct(status:string,limit:number,offset:number): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl+  SUB_URL, {headers, params: { offset: offset, limit: limit, type: status}});
  }

  getAllActiveProduct(status:string): Observable<any> {
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
  
  saveProduct(category:any): Observable<any> {
    console.log(category)
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.post<any>(environment.baseUrl + SUB_URL, category, {headers});
  }

  getProduct(id:string): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get<any>(environment.baseUrl + SUB_URL + "/" + id, {headers});
  }

  uploadCatalogue(file: any, id: any) {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.post<any>(environment.baseUrl + SUB_URL + "/upload/" + id, formData, {headers});
  }

  downloadStock() {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.get(environment.baseUrl + "/csv/download" , { headers ,responseType: 'blob'});
  }

  uploadStock(file: any) {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.post<any>(environment.baseUrl + "/csv/upload" , formData, {headers});
  }

}
