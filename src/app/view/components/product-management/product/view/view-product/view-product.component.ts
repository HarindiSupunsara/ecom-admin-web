import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/service/product/product.service';
import { AlertComponent } from 'src/app/view/core/alert/alert/alert.component';
import { ConfirmationAlertComponent } from 'src/app/view/core/alert/confirmation-alert/confirmation-alert.component';
import { FileUploaderAlertComponent } from 'src/app/view/core/alert/file-uploader-alert/file-uploader-alert.component';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewProductComponent implements AfterViewInit {

  loading = false;
  productList : any[] = new Array();

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['name','qoh','price','description','displayOrder','brand','category','status','edit', 'upload'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  roleId = "";

  showSearch = true;

  length = 0;

  permissionList = new Array();

  approve = false;

  expandedElement: any[] | undefined ;

  constructor(private productService:ProductService,private dialog: MatDialog,private routes:ActivatedRoute,private router:Router) { 
    
  }

  ngAfterViewInit(): void {
    // let menuList = JSON.parse(sessionStorage.getItem("menu_perm") || '{}');
    // let permissions = menuList.find((l: { name: string; }) => l.name == "Broker").permissionDtos;

    // if(permissions != null){
    //   permissions.forEach((ele: { name: any; }) => {
    //     this.permissionList.push(ele.name);
    //   });
    // }

    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 50;
    this.getAllProduct();
  }

  getAllProduct() {
    this.loading = true;
    this.productList = new Array();
    this.productService.getCount("").subscribe((response: { data: { Count: number; }; }) => {
      console.log(response);
      this.length = response.data.Count;
      this.productService.getAllProduct("ALL",this.paginator.pageSize, this.paginator.pageIndex).subscribe((resp: any[] | null) => {
        this.loading = false;
        console.log(resp);
        if (resp != null) {
          resp.forEach((element: any) => {
            this.productList.push(element);
          });

          this.expandedElement = this.productList;

          this.dataSource = new MatTableDataSource(this.productList);
          this.dataSource.paginator = this.paginator;
        }
      }, (error: { message: string; }) => {
        this.loading = false;
        this.alert("Failed", error.message, "error", "");
      });
    }, (error: { message: string;status: number }) => {
      this.loading = false;
      if(error.status == 401){
        this.alert("Oopz..", "Your Session has expired.", "error", "");
      }else{
        this.alert("Failed", error.message, "error", "");
      }
      
    });
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
    this.getAllProduct();
  }

  search(){
    if(this.showSearch){
      this.showSearch = false;
    }else{
      this.showSearch = true;
    }
  }

  changeProductStatus(row: any, e: any) {
    console.log(e);
    if (!this.approve) {
      this.alertconfirmation("Are you sure!", ["Do you want to change the status?"], "success", "", row, e);
    }
    if (this.approve) {
      console.log(row);
      this.approve = false;
      this.productService.changeStatus(row.id, row.status).subscribe((response:any) => {
        if (response.status == "200") {
          this.getAllProduct();
          this.alert("Success", "Status changed successfully", "success", "");
          this.approve = false;
        } else {
          this.alert("Failed", response.message , "error", "");

        }

      }, (error: { message: string;status: number }) => {
        this.loading = false;
        if(error.status == 401){
          this.alert("Oopz..", "Your Session has expired.", "error", "");
        }else{
          this.alert("Failed", error.message, "error", "");
        }
        
      });
    }
  }

  uploadFile(e:any,id:any){
    console.log(e.target.files[0]);
    this.loading = true;
    this.productService.uploadCatalogue(e.target.files[0],id).subscribe((response:any) => {
      this.loading = false;
      if(response.status == "200"){
        this.alert("Success", "Catalogue Upload Successfully", "success", "");
      }
    }, (error: { message: string;status: number }) => {
      this.loading = false;
      if(error.status == 401){
        this.alert("Oopz..", "Your Session has expired.", "error", "");
      }else{
        this.alert("Failed", error.message, "error", "");
      }
      
    });
  }

  
  downloadstock(){
    this.loading = true;
    this.productService.downloadStock().subscribe({
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
  }

  stockUpdate(file:any){
    console.log(file);
    this.loading = true;
    this.productService.uploadStock(file).subscribe({
      next: ((response:any) => {
        this.loading = false;
        console.log(response);
        if(response.status == "200"){
          this.alert("Success", "Stock Upload Successfully", "success", "");
        }
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

  alertconfirmation(title: string, message: string[], type: string, method: string, row: any, e: any) {
    console.log(row);
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: method,
      title: title,
      message: message,
      type: type
    };

    const dialogRef = this.dialog.open(ConfirmationAlertComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result:any) => {

      if (result.result === "yes") {
        if (e.checked) {
          row.status = 1;
        } else {
          row.status = 0;
        }
        this.approve = true;
        this.changeProductStatus(row, e);
      } else {
        if (row.status == 1) {
          row.status = 0;
        } else {
          row.status = 1;
        }

        this.approve = false;
      }

    });

  }

  stockuploadalert() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
    };

    const dialogRef = this.dialog.open(FileUploaderAlertComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result:any) => {

      if (result.result === "yes") {
        this.stockUpdate(result.file);
      } else {
        
      }

    });

  }

}
