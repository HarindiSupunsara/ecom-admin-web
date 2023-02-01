import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;

  error:string = "";
  
  loginForm = new UntypedFormGroup({
    userName: new UntypedFormControl("", Validators.required),
    password: new UntypedFormControl("", Validators.required)
  });

  constructor(private authService : AuthService, private router: Router) { }

  ngOnInit(): void { }

  get userName() {
    return this.loginForm.get("userName");
  }

  get password() {
    return this.loginForm.get("password");
  }

  signin() {
    if(this.loginForm.valid){
      this.error = "";
      this.authService.login(this.userName?.value, this.password?.value).subscribe((resp): void => {
          console.log(resp);
          
        if(resp.status == '200'){
          sessionStorage.setItem("user" ,resp.data.userId);
          sessionStorage.setItem("token", resp.data.token);
          sessionStorage.setItem("refresh_token", resp.data.refreshToken);
          sessionStorage.setItem("name", resp.data.name);
          sessionStorage.setItem("menu_perm", JSON.stringify(resp.data.menuList));
          console.log(resp);
          this.router.navigate(['/']);
        } else{
          this.error = resp.data.message;
        }
        
      }, (error :any)=> {
        console.log(error);
        if(error.status == "500"){
          this.error = "Internal Server Error! Please try again later.";
        }else if(error.status == "401"){
          this.error = "Unauthorized Request! Please check your credentials.";
        }
        
      })
    } else{
      this.error = "Username and Password are required.";
    }
    
  }


}
