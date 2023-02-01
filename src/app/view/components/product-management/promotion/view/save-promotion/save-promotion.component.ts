import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionService } from 'src/app/service/promotion/promotion.service';
import { AlertComponent } from 'src/app/view/core/alert/alert/alert.component';

@Component({
  selector: 'app-save-promotion',
  templateUrl: './save-promotion.component.html',
  styleUrls: ['./save-promotion.component.scss']
})
export class SavePromotionComponent implements OnInit {

  screenName: string = "";
  editId: string = "";
  menuPermList = new Array();

  loading = false;

  promotionForm = new UntypedFormGroup({
    name: new UntypedFormControl("", Validators.required),
    promoCode: new UntypedFormControl("", Validators.required),
    type: new UntypedFormControl("", Validators.required),
    value: new UntypedFormControl("", Validators.required),
    startDate: new UntypedFormControl("", Validators.required),
    endDate: new UntypedFormControl("", Validators.required),
  });

  base64textString: string = "";
  imgSrc: string = "";

  get Type() {
    return this.promotionForm.get("type");
  }

  get Name() {
    return this.promotionForm.get("name");
  }

  get PromoCode() {
    return this.promotionForm.get("promoCode");
  }

  get Value() {
    return this.promotionForm.get("value");
  }

  get StartDate() {
    return this.promotionForm.get("startDate");
  }

  get EndDate() {
    return this.promotionForm.get("endDate");
  }

  editPromotion: any | undefined;

  permissionList = new Array();

  constructor(private routes: ActivatedRoute, private promotionService: PromotionService, private dialog: MatDialog, private router: Router) {
    this.routes.params.subscribe(param => {
      this.editId = param['data'];
      (this.editId != undefined) ? this.screenName = "Edit Promotion" : this.screenName = "New Promotion";
      console.log(this.editId);

      if (this.editId != undefined && this.editId != null) {
        this.getPromotion();
      }

    });
  }

  ngOnInit(): void {

  }

  getPromotion() {
    this.loading = true;
    this.promotionService.getPromotion(this.editId).subscribe((response: any) => {
      console.log(response);
      this.loading = false;
      if (response != null) {
        this.editPromotion = response;
        this.Type?.setValue(this.editPromotion.type);
        this.Name?.setValue(this.editPromotion.name);
        this.PromoCode?.setValue(this.editPromotion.promoCode);
        this.Value?.setValue(this.editPromotion.value);
        this.StartDate?.setValue(this.editPromotion.startDate);
        this.EndDate?.setValue(this.editPromotion.endDate);
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


  save() {
    if (this.promotionForm.valid) {
      if (this.editId != undefined && this.editId != null) {
        this.editPromotion.modifyBy = sessionStorage.getItem("user");
      } else {
        this.editPromotion = new Object();
        this.editPromotion.id = null;
        this.editPromotion.createBy = sessionStorage.getItem("user");
      }
      this.editPromotion.type = this.Type?.value;
      this.editPromotion.name = this.Name?.value;
      this.editPromotion.promoCode = this.PromoCode?.value;
      this.editPromotion.value = this.Value?.value;
      this.editPromotion.startDate = this.StartDate?.value;
      this.editPromotion.endDate = this.EndDate?.value;

      console.log(this.editPromotion);
      this.loading = true;
      this.promotionService.savePromotion(this.editPromotion).subscribe((response: any) => {
        this.loading = false;
        if (response.status == "200") {
          this.alert("Success", "Promotion Saved Successfully..", "success", "");
          this.router.navigate(['home/promotion']);
        } else {
          this.alert("Failed", response.message, "error", "");
        }
      }, (error: { message: string; status: number }) => {
        this.loading = false;
        if (error.status == 401) {
          this.alert("Oopz..", "Your Session has expired.", "error", "");
        } else {
          this.alert("Failed", error.message, "error", "");
        }

      });

    } else {
      this.alert("Error", "Please fill all required data..", "error", "");
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
