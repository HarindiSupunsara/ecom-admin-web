import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-change-password-alert',
  templateUrl: './change-password-alert.component.html',
  styleUrls: ['./change-password-alert.component.scss']
})
export class ChangePasswordAlertComponent implements OnInit {

  pwFormGroup = new UntypedFormGroup({
    password: new UntypedFormControl("", Validators.required),
    newPassword: new UntypedFormControl("",  [Validators.required,Validators.pattern("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$")]),
    confirmPassword: new UntypedFormControl("",  [Validators.required])
  });

  hide = true;
  nhide = true;
  chide = true;
  choise: string = "no";


  constructor(private dialogRef: MatDialogRef<ChangePasswordAlertComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    
    console.log(data)
  }

   
  get Password(){
    return this.pwFormGroup.get("password");
  }

  get NewPassword(){
    return this.pwFormGroup.get("newPassword");
  }

  get ConfirmPassword(){
    return this.pwFormGroup.get("confirmPassword");
  }

  ngOnInit() {
  }

  yesConfirmation(){
    this.choise="yes";
    if(this.pwFormGroup.valid){
      if(this.NewPassword?.value === this.ConfirmPassword?.value && this.Password?.value != this.NewPassword?.value){
        this.dialogRef.close({result:this.choise,password: this.Password?.value,newPassword: this.NewPassword?.value});
      }
    }
  }

  noConfirmation(){
    this.choise="no";
    this.dialogRef.close({result:this.choise});
  }

}
