import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-file-uploader-alert',
  templateUrl: './file-uploader-alert.component.html',
  styleUrls: ['./file-uploader-alert.component.scss']
})
export class FileUploaderAlertComponent implements OnInit {

  file: any;
  choise: string = "no";

  constructor(private dialogRef: MatDialogRef<FileUploaderAlertComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
   }

  ngOnInit() {
  }

  yesConfirmation(){
    if(this.file != null && this.file != undefined){
      this.choise="yes";
      this.dialogRef.close({result:this.choise,file:this.file});
    }
  }

  noConfirmation(){
    this.choise="no";
    this.dialogRef.close({result:this.choise});
  }

  selectFile(evt: any) {
    console.log(evt);
    var files = evt.target.files;
    this.file = files[0];
  }


}
