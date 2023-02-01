import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user/user.service';
import { ChangePasswordAlertComponent } from '../alert/change-password-alert/change-password-alert.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  menuList:any[] = new Array();

  panelOpenState = false;

  activeMenu = 1;

  sessionStorage = sessionStorage;
  
  constructor(private router:Router,public dialog: MatDialog, private userService:UserService) { }

  ngOnInit(): void {
    let menu = JSON.parse(sessionStorage.getItem("menu_perm") || '{}');
    menu.forEach((ele : any) => {
      this.menuList.push(ele);
    });
    console.log(this.menuList);
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(["/login"]);
  }

  alertChangePw() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      
    };

    const dialogRef = this.dialog.open(ChangePasswordAlertComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result:any) => {

      if (result.result === "yes") {
        this.changePw(result.password,result.newPassword);
      } else {
      }

    });

  }

  changePw(password: any, newPassword: any) {
    this.userService.changePassword(password,newPassword).subscribe(response => {
      if(response.code == 200){
        this.router.navigate(['/login']);
      }else if(response.code == 204){
        this.alertChangePw();
      }
    });
  }

}
