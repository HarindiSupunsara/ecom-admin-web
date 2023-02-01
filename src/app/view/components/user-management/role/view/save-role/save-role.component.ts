import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from 'src/app/service/role/role.service';
import { AlertComponent } from 'src/app/view/core/alert/alert/alert.component';

@Component({
  selector: 'app-save-role',
  templateUrl: './save-role.component.html',
  styleUrls: ['./save-role.component.css']
})
export class SaveRoleComponent implements OnInit {

  screenName: string = "";
  editId: string = "";
  filteredOptions: Observable<any[]> | undefined;
  menuPermList = new Array();

  loading = false;

  roleForm = new UntypedFormGroup({
    name: new UntypedFormControl("", Validators.required)
  });

  get Name() {
    return this.roleForm.get("name");
  }

  editRole: any | undefined;

  permissionList = new Array();

  constructor(private routes: ActivatedRoute, private roleService: RoleService, private dialog: MatDialog, private router: Router) {
    this.routes.params.subscribe(param => {
      this.editId = param['data'];
      (this.editId != undefined) ? this.screenName = "Edit Role" : this.screenName = "New Role";
      console.log(this.editId);

      if (this.editId != undefined && this.editId != null) {
        this.getRole();
      }

    });
  }

  ngOnInit(): void {
  }

  getRole() {
    this.loading = true;
    this.roleService.getRole(this.editId).subscribe((response: any) => {
      console.log(response);
      this.loading = false;
      if (response != null) {
        this.editRole = response;
        this.Name?.setValue(this.editRole.name);

        // if(response.roleMenuDtos != undefined && response.roleMenuDtos != null){
        //   this.menuPermList = new Array();
        //   response.roleMenuDtos.forEach((element:any) => {
        //     let permMenu = {
        //       "id":element.id,
        //       "menu": element.menu,
        //       "enabled": element.enabled,
        //     }

        //     this.menuPermList.push(permMenu);
        //   });
        // }
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
    if (this.roleForm.valid){
        if (this.editId != undefined && this.editId != null) {
          this.editRole.modifyBy = sessionStorage.getItem("user");
        } else {
          this.editRole = new Object();
          this.editRole.id = null;
          this.editRole.createBy = sessionStorage.getItem("user");
        }
        this.editRole.name = this.Name?.value;
        console.log(this.editRole);
        this.loading = true;
        this.roleService.saveRole(this.editRole).subscribe((response: any) => {
          this.loading = false;
          if (response.status == "200") {
            this.alert("Success", "Role Saved Successfully..", "success", "");
            this.router.navigate(['home/role']);
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
