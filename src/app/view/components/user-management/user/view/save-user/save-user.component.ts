import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from 'src/app/service/menu/menu.service';
import { RoleService } from 'src/app/service/role/role.service';
import { UserService } from 'src/app/service/user/user.service';
import { AlertComponent } from 'src/app/view/core/alert/alert/alert.component';

@Component({
  selector: 'app-save-user',
  templateUrl: './save-user.component.html',
  styleUrls: ['./save-user.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SaveUserComponent implements OnInit {

  screenName: string = "";
  editId: string = "";

  loading = false;

  userBasicFormGroup = new UntypedFormGroup({
    fullName: new UntypedFormControl("", Validators.required),
    nic: new UntypedFormControl("", [Validators.required,Validators.pattern('^([0-9]{9}[x|X|v|V]|[0-9]{12})$')]),
    mobile: new UntypedFormControl("", Validators.required),
    email: new UntypedFormControl("", [Validators.required,Validators.email])
  });

  roleFormGroup = new UntypedFormGroup({
    role: new UntypedFormControl("", Validators.required),
    menu: new UntypedFormControl("", Validators.required),
  });

  get FullName() {
    return this.userBasicFormGroup.get("fullName");
  }

  get Nic() {
    return this.userBasicFormGroup.get("nic");
  }

  get Mobile() {
    return this.userBasicFormGroup.get("mobile");
  }

  get Email() {
    return this.userBasicFormGroup.get("email");
  }

  get Role() {
    return this.roleFormGroup.get("role");
  }

  get Menu() {
    return this.roleFormGroup.get("menu");
  }

  roleList = new Array();

  menuList = new Array();

  editUser: any | undefined;

  previousRoleList : any[] = new Array();

  constructor(private routes: ActivatedRoute, private userService: UserService, private dialog: MatDialog, private router: Router, private roleService: RoleService,
    private menuService:MenuService) {
    this.routes.params.subscribe(param => {
      this.editId = param['data'];
      (this.editId != undefined) ? this.screenName = "Edit User" : this.screenName = "New User";
      console.log(this.editId);
    });
  }

  ngOnInit(): void {
    this.getActiveRoles();
    this.getAllActiveMenu();
  }

  getActiveRoles(){
    this.loading = true;
    this.roleList = new Array();
    this.roleService.getAllActiveRoles("ACTIVE").subscribe((response: any) => {
      this.loading = false;
      this.roleList = response;
    }, (error: any) => {
      this.loading = false;
      this.alert("Failed", error.message, "error", "");
    });
  }

  getUser() {
    this.loading = true;
    this.userService.getUser(this.editId).subscribe((response: any) => {
      this.loading = false;
      if (response != null) {
        this.editUser = response;
        this.FullName?.setValue(this.editUser.name);
        this.Email?.setValue(this.editUser.email);
        this.Mobile?.setValue(this.editUser.mobile);
        this.Nic?.setValue(this.editUser.nic);
        this.Role?.setValue(this.editUser.roleId);

        if(response.menuDtos != null && response.menuDtos != undefined){
          let menuIds = new Array();
          response.menuDtos.forEach((menu:any) => {
            let select = this.menuList.find(m => m.id == menu.id);
            menuIds.push(select.id);
          });

          this.Menu?.setValue(menuIds);
        }
      }
    }, (error: any) => {
      this.loading = false;
      this.alert("Failed", error.message, "error", "");
    });
  }

  getAllActiveMenu(){
    this.loading = true;
    this.menuList = new Array();
    this.menuService.getAllActiveMenus("ACTIVE").subscribe((response: any) => {
      this.loading = false;
      this.menuList = response;

      if (this.editId != undefined && this.editId != null) {
        this.getUser();
      }

    }, (error: any) => {
      this.loading = false;
      this.alert("Failed", error.message, "error", "");
    });
  }

  save() {
    if (this.userBasicFormGroup.valid && this.roleFormGroup.valid){
        if (this.editId != undefined && this.editId != null) {
          this.editUser.modifyBy = sessionStorage.getItem("user");
        } else {
          this.editUser = new Object();
          this.editUser.id = null;
          this.editUser.createBy = sessionStorage.getItem("user");
        }
        
        this.editUser.name = this.FullName?.value;
        this.editUser.nic = this.Nic?.value;
        this.editUser.email = this.Email?.value;
        this.editUser.mobile = this.Mobile?.value;
        this.editUser.roleId = this.Role?.value;

        console.log(this.Menu?.value);

        let menuIds:any[] = this.Menu?.value;

        let menuDtos = new Array();

        menuIds.forEach(e => {
          let menu = this.menuList.find(m => m.id == e);
          menuDtos.push(menu);
        });

        this.editUser.menuDtos = menuDtos;

        console.log(this.editUser);
        this.loading = true;
        this.userService.saveUser(this.editUser).subscribe((response: any) => {
          this.loading = false;
          if (response.status == "200") {
            this.alert("Success", "User Saved Successfully..", "success", "");
            this.router.navigate(['home/user']);
          } else {
            this.alert("Failed", response.message, "error", "");
          }
        }, (error: any) => {
          this.loading = false;
          this.alert("Failed", error.message, "error", "");
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
