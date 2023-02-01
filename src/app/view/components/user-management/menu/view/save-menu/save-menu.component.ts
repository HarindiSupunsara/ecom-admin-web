import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from 'src/app/service/menu/menu.service';
import { PermissionService } from 'src/app/service/permission/permission.service';
import { AlertComponent } from 'src/app/view/core/alert/alert/alert.component';

@Component({
  selector: 'app-save-menu',
  templateUrl: './save-menu.component.html',
  styleUrls: ['./save-menu.component.css']
})
export class SaveMenuComponent implements OnInit {

  screenName: string = "";
  editId: string = "";

  loading = false;

  menuForm = new UntypedFormGroup({
    name: new UntypedFormControl("", Validators.required),
    parentMenu: new UntypedFormControl(""),
    permission: new UntypedFormControl("", Validators.required),
  });

  get Name() {
    return this.menuForm.get("name");
  }

  get ParentMenu() {
    return this.menuForm.get("parentMenu");
  }

  get Permission() {
    return this.menuForm.get("permission");
  }

  editMenu: any | undefined;

  parentMenuList = new Array();

  permissionList = new Array();

  constructor(private routes: ActivatedRoute, private permissionService: PermissionService, private menuService:MenuService, private dialog: MatDialog, private router: Router) {
    this.getAllActiveMenus();
    this.getAllActivePermissions();
    this.routes.params.subscribe(param => {
      this.editId = param['data'];
      (this.editId != undefined) ? this.screenName = "Edit Menu" : this.screenName = "New Menu";
      console.log(this.editId);

      if (this.editId != undefined && this.editId != null) {
        this.getMenu();
      }

    });
  }

  ngOnInit(): void {
  }

  getAllActivePermissions(){
    this.loading = true;
    this.permissionService.getAllActivePermissions("ACTIVE").subscribe((response: any) => {
      this.loading = false;
      console.log(response);
      if(response != null){
        this.permissionList = response;
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

  getAllActiveMenus(){
    this.loading = true;
    this.menuService.getAllActiveMenus("ACTIVE").subscribe((response: any) => {
      this.loading = false;
      if(response != null){
        this.parentMenuList = response;
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

  getMenu() {
    this.loading = true;
    this.menuService.getMenu(this.editId).subscribe((response: any) => {
      console.log(response);
      this.loading = false;
      if (response != null) {
        this.editMenu = response;
        this.Name?.setValue(this.editMenu.name);
        this.ParentMenu?.setValue(this.editMenu.parent);

        if(this.editMenu.permissionDtos !=  null && this.editMenu.permissionDtos != undefined){
          let array = new Array();
          this.editMenu.permissionDtos.forEach((menu : any) => {
            array.push(menu.id);
          });
          console.log(array);
          this.Permission?.setValue(array);
        }
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

  toggleAllSelection(id: any){
    console.log(id);
    if(this.editMenu != null && this.editMenu != undefined){
      if(this.editMenu.permissionDtos != null && this.editMenu.permissionDtos != undefined){
        let perm = this.editMenu.permissionDtos.find((p:any) => p.id === id);
        if(perm != null && perm != undefined){
          if(perm.status == 1){
            perm.status = 0;
          }else{
            perm.status = 1;
          }
        }else{
          let findPerm = this.permissionList.find((p:any) => p.id === id);
          if(findPerm != null && findPerm != undefined){
            findPerm.status = 1;
            this.editMenu.permissionDtos.push(findPerm);
          }
        }
      }
    }else{
      let findPerm = this.permissionList.find((p:any) => p.id === id);
      let permissionDtos = new Array();

      if(findPerm != null && findPerm != undefined){
        findPerm.status = 1;
        permissionDtos.push(findPerm);
        this.editMenu = {
          "permissionDtos" : permissionDtos
        }
      }
    }
    
    console.log(this.editMenu.permissionDtos);
  }

  save() {
    if (this.menuForm.valid){
        let permissions = this.editMenu.permissionDtos;
        if (this.editId != undefined && this.editId != null) {
          this.editMenu.modifyBy = sessionStorage.getItem("user");
        } else {
          this.editMenu = new Object();
          this.editMenu.id = null;
          this.editMenu.createBy = sessionStorage.getItem("user");
        }
        console.log(this.editMenu);
        this.editMenu.name = this.Name?.value;
        this.editMenu.permissionDtos = permissions;
        this.editMenu.parent = this.ParentMenu?.value;
        this.loading = true;
        this.menuService.saveMenu(this.editMenu).subscribe((response: any) => {
          this.loading = false;
          if (response.status == "200") {
            this.alert("Success", "Menu Saved Successfully..", "success", "");
            this.router.navigate(['home/menu']);
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
