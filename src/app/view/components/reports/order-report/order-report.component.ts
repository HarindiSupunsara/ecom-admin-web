import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportsService } from 'src/app/service/reports/reports.service';
import { AlertComponent } from 'src/app/view/core/alert/alert/alert.component';

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.scss']
})
export class OrderReportComponent implements OnInit {

  constructor(private reportService:ReportsService,private dialog: MatDialog,private routes:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
  }

  startDate =new FormControl("", Validators.required);
  
  endDate = new FormControl("", Validators.required);


  loading = false;
  orderList : any[] = new Array();

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['orderId','orderDate','productName','unitPrice','qty','discount','subTotal','customerName','mobile','email','opaymentType','dcity','ostatus','opaymentStatus','bcity',
                                'bmobile','dcompanyName','dcontactPerson','baddress','dmobile','bcontactPerson','bemail','dphone','daddress','demail','bphone','bcompanyName'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  roleId = "";

  showSearch = true;

  length = 0;

  permissionList = new Array();

  approve = false;

  option = "Pending";

  ngAfterViewInit(): void {
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 10;
    //this.getAllOrders();
  }

  getAllOrders() {
    if(this.startDate.valid && this.endDate.valid){
      this.loading = true;
      this.orderList = new Array();
        this.reportService.viewSalesReportData(this.startDate.value,this.endDate.value).subscribe((resp: any[] | null) => {
          this.loading = false;
          console.log(resp);
          if (resp != null) {
            resp.forEach((element: any) => {
              this.orderList.push(element);
            });

            this.dataSource = new MatTableDataSource(this.orderList);
            this.dataSource.paginator = this.paginator;
            this.paginator.length = this.orderList.length;
          }
        }, (error: { message: string; }) => {
          this.loading = false;
          this.alert("Failed", error.message, "error", "");
        });
      }else{
        this.alert("Oopzz", "Please select the valid date range.", "error", "");
      }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  loadNextData() {
    this.getAllOrders();
  }

  search(){
    if(this.showSearch){
      this.showSearch = false;
    }else{
      this.showSearch = true;
    }
  }

  downloadReport(){
    if(this.startDate.valid && this.endDate.valid){
      this.loading = true;
      this.reportService.downloadSalesReport(this.startDate.value,this.endDate.value).subscribe({
        next: ((response:any) => {
          console.log(response);
          this.loading = false;
          // const blob = response;
          const url= window.URL.createObjectURL(response);
          window.open(url);
        }),
        error : (error => {
          this.loading = false;
          if(error.status == 401){
            this.alert("Oopz..", "Your Session has expired.", "error", "");
          }else{
            this.alert("Failed", error.message, "error", "");
          }
        })
      });
    }else{
      this.alert("Oopzz", "Please select the valid date range.", "error", "");
    }
    
  }

  /**
     * @param title 
     * @param message 
     * @param type 
     * @param id 
     */
   alert(title: string, message: string, type: string, id: string) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: id,
      title: title,
      message: message,
      type: type
    };

    const dialogRef = this.dialog.open(AlertComponent, dialogConfig);
  }

}
