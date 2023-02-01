import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SliderService } from 'src/app/service/slider/slider.service';
import { AlertComponent } from 'src/app/view/core/alert/alert/alert.component';
import { ConfirmationAlertComponent } from 'src/app/view/core/alert/confirmation-alert/confirmation-alert.component';

@Component({
  selector: 'app-view-slider',
  templateUrl: './view-slider.component.html',
  styleUrls: ['./view-slider.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewSliderComponent implements AfterViewInit {

  loading = false;
  sliderList : any[] = new Array();

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['content','html','displayOrder','createBy','createDate','status','edit'];

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

  constructor(private sliderService:SliderService,private dialog: MatDialog,private routes:ActivatedRoute,private router:Router) { 
    
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
    this.paginator.pageSize = 6;
    this.getAllSlider();
  }

  getAllSlider() {
    this.loading = true;
    this.sliderList = new Array();
    this.sliderService.getCount("").subscribe((response: { data: { Count: number; }; }) => {
      console.log(response);
      this.length = response.data.Count;
      this.sliderService.getAllSlider("ALL",this.paginator.pageSize, this.paginator.pageIndex).subscribe((resp: any[] | null) => {
        this.loading = false;
        console.log(resp);
        if (resp != null) {
          resp.forEach((element: any) => {
            this.sliderList.push(element);
          });

          this.expandedElement = this.sliderList;

          this.dataSource = new MatTableDataSource(this.sliderList);
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
    this.getAllSlider();
  }

  search(){
    if(this.showSearch){
      this.showSearch = false;
    }else{
      this.showSearch = true;
    }
  }

  changeSliderStatus(row: any, e: any) {
    console.log(e);
    if (!this.approve) {
      this.alertconfirmation("Are you sure!", ["Do you want to change the status?"], "success", "", row, e);
    }
    if (this.approve) {
      console.log(row);
      this.approve = false;
      this.sliderService.changeStatus(row.id, row.status).subscribe((response:any) => {
        if (response.status == "200") {
          this.getAllSlider();
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
        this.changeSliderStatus(row, e);
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
}
