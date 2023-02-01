import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionService } from 'src/app/service/permission/permission.service';
import { AlertComponent } from 'src/app/view/core/alert/alert/alert.component';

@Component({
  selector: 'app-save-permission',
  templateUrl: './save-permission.component.html',
  styleUrls: ['./save-permission.component.css']
})
export class SavePermissionComponent implements OnInit {

  screenName: string = "";
  editId: string = "";

  loading = false;

  permissionForm = new UntypedFormGroup({
    name: new UntypedFormControl("", Validators.required)
  });

  get Name() {
    return this.permissionForm.get("name");
  }

  editPermission: any | undefined;

  constructor(private routes: ActivatedRoute, private permissionService: PermissionService, private dialog: MatDialog, private router: Router) {
    this.routes.params.subscribe(param => {
      this.editId = param['data'];
      (this.editId != undefined) ? this.screenName = "Edit Permission" : this.screenName = "New Permission";
      console.log(this.editId);

      if (this.editId != undefined && this.editId != null) {
        this.getPermission();
      }

    });
  }

  ngOnInit(): void {
  }

  getPermission() {
    this.loading = true;
    this.permissionService.getPermission(this.editId).subscribe((response: any) => {
      console.log(response);
      this.loading = false;
      if (response != null) {
        this.editPermission = response;
        this.Name?.setValue(this.editPermission.name);
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


  save() {
    if (this.permissionForm.valid){
        if (this.editId != undefined && this.editId != null) {
          this.editPermission.modifyBy = sessionStorage.getItem("user");
        } else {
          this.editPermission = new Object();
          this.editPermission.id = null;
          this.editPermission.createBy = sessionStorage.getItem("user");
        }
        console.log(this.editPermission);
        this.editPermission.name = this.Name?.value;
        this.loading = true;
        this.permissionService.savePermission(this.editPermission).subscribe((response: any) => {
          this.loading = false;
          if (response.status == "200") {
            this.alert("Success", "Permission Saved Successfully..", "success", "");
            this.router.navigate(['home/permission']);
          } else {
            this.alert("Failed", response.message, "error", "");
          }
        }, (error: { message: string;status: number }) => {
          this.loading = false;
          if(error.status == 401){
            this.alert("Oopz..", "Your Session has expired.", "error", "");
          }else{
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
