import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SmsConfigService } from 'src/app/service/sms-config/sms-config.service';
import { AlertComponent } from 'src/app/view/core/alert/alert/alert.component';

@Component({
  selector: 'app-save-sms-config',
  templateUrl: './save-sms-config.component.html',
  styleUrls: ['./save-sms-config.component.scss']
})
export class SaveSmsConfigComponent implements OnInit {

  screenName: string = "";
  editId: string = "";
  menuPermList = new Array();

  loading = false;

  smsForm = new UntypedFormGroup({
    type: new UntypedFormControl("", Validators.required),
    mobile: new UntypedFormControl("", Validators.required),
  });

  base64textString: string = "";
  imgSrc: string = "";

  get Type() {
    return this.smsForm.get("type");
  }

  get Mobile() {
    return this.smsForm.get("mobile");
  }

  editSms: any | undefined;

  permissionList = new Array();

  constructor(private routes: ActivatedRoute, private smsService: SmsConfigService, private dialog: MatDialog, private router: Router) {
    this.routes.params.subscribe(param => {
      this.editId = param['data'];
      (this.editId != undefined) ? this.screenName = "Edit SMS" : this.screenName = "New SMS";
      console.log(this.editId);

      if (this.editId != undefined && this.editId != null) {
        this.getBrand();
      }

    });
  }

  ngOnInit(): void {

  }

  getBrand() {
    this.loading = true;
    this.smsService.getSms(this.editId).subscribe((response: any) => {
      console.log(response);
      this.loading = false;
      if (response != null) {
        this.editSms = response;
        this.Type?.setValue(this.editSms.type);
        this.Mobile?.setValue(this.editSms.mobile);
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
    if (this.smsForm.valid) {
      if (this.editId != undefined && this.editId != null) {
        this.editSms.modifyBy = sessionStorage.getItem("user");
      } else {
        this.editSms = new Object();
        this.editSms.id = null;
        this.editSms.createBy = sessionStorage.getItem("user");
      }
      this.editSms.type = this.Type?.value;
      this.editSms.mobile = this.Mobile?.value;

      console.log(this.editSms);
      this.loading = true;
      this.smsService.saveSms(this.editSms).subscribe((response: any) => {
        this.loading = false;
        if (response.status == "200") {
          this.alert("Success", "SMS Config Saved Successfully..", "success", "");
          this.router.navigate(['home/sms-config']);
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
