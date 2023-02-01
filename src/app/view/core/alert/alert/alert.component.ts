import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  modalTitle: string;
  modelMessage : string;
  modelType : string;
  id : string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AlertComponent>) {
    this.modalTitle = data.title;
    this.modelMessage = data.message;
    this.modelType = data.type;
    this.id = data.id;

    console.log(data)
   }

  ngOnInit() {
  }

  yesConfirmation(){
    this.dialogRef.close({ choice: "yes"});
  }


}
