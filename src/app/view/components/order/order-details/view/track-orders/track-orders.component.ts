import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDetailsService } from 'src/app/service/order-details/order-details.service';
import { AlertComponent } from 'src/app/view/core/alert/alert/alert.component';

@Component({
  selector: 'app-track-orders',
  templateUrl: './track-orders.component.html',
  styleUrls: ['./track-orders.component.scss']
})
export class TrackOrdersComponent implements OnInit {

  loading = false;

  orderId:any = "";

  editOrder: any | undefined;

  displayedColumns: string[] = ['name', 'price', 'count', 'total'];
  dataSource = new MatTableDataSource();

  orderStage = new FormControl();

  constructor(private routes: ActivatedRoute, private orderService: OrderDetailsService, private dialog: MatDialog, private router: Router) {
    this.routes.params.subscribe(param => {
      this.orderId = param['id'];
      console.log(this.orderId);
      this.getOrder();
    });
  }


  ngOnInit(): void {
  }

  getOrder(){
    this.loading = true;
    this.orderService.getOrder(this.orderId).subscribe((response: any) => {
      console.log(response);
      this.loading = false;
      if (response != null) {
        this.editOrder = response;
      }
    }, (error: { message: string; status: number }) => {
      this.loading = false;
      if (error.status == 401) {
        this.alert("Oopz..", "Your Session has expired.", "error", "");
      } else {
        this.alert("Failed", error.message, "error", "");
      }

    });
  }

  changeOrderStage(){
    console.log(this.orderStage.value);
    if(this.orderStage.value != undefined && this.orderStage.value != null){
      switch (this.orderStage.value) {
        case "Confirmed":
          if(this.editOrder?.orderStage != "Pending"){
            return;
          }
          break;
  
        case "Packaging":
          if(this.editOrder?.orderStage != "Confirmed"){
            return;
          }
          break;
  
        case "Shipping":
          if(this.editOrder?.orderStage != "Packaging"){
            return;
          }
          break;
  
        case "Delivered":
          if(this.editOrder?.orderStage != "Shipping"){
            return;
          }
          break;

        case "Cancel":
            
            break;
      
        default:
          return;
          break;
      }
  
      this.loading = true;

      this.orderService.changeOrderStage(this.editOrder.order_id,this.orderStage.value).subscribe((response: any) => {
        console.log(response);
        this.loading = false;
        if (response.status == "200") {
          this.alert("Success", "Order Stage Changed..", "success", "");
          this.router.navigate(['orders']);
        }
      }, (error: { message: string; status: number }) => {
        this.loading = false;
        if (error.status == 401) {
          this.alert("Oopz..", "Your Session has expired.", "error", "");
        } else {
          this.alert("Failed", error.message, "error", "");
        }
  
      });
    }
    
  }

  /**
   * Alerts add employee component
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
