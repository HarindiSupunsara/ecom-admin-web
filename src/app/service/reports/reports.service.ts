import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const SUB_URL= "/report";

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http:HttpClient) { }

  viewSalesReportData(fromDate:any,toDate:any): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    let obj = {
      "fromDate": fromDate,
      "toDate" : toDate
    }
    return this.http.post(environment.baseUrl+ SUB_URL + "/sales-report", obj, {headers});
  }

  downloadSalesReport(fromDate:any,toDate:any) {
    let obj = {
      "fromDate": fromDate,
      "toDate" : toDate
    }
    const headers = new HttpHeaders().set("Authorization", sessionStorage.getItem("token")!);
    return this.http.post(environment.baseUrl + SUB_URL + "/sales-report/download", obj , { headers ,responseType: 'blob'});
  }
}
