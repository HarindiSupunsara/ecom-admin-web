import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SliderService } from 'src/app/service/slider/slider.service';
import { AlertComponent } from 'src/app/view/core/alert/alert/alert.component';

@Component({
  selector: 'app-save-slider',
  templateUrl: './save-slider.component.html',
  styleUrls: ['./save-slider.component.scss']
})
export class SaveSliderComponent implements OnInit {

  screenName: string = "";
  editId: string = "";
  menuPermList = new Array();

  loading = false;

  sliderForm = new UntypedFormGroup({
    // name: new FormControl("", Validators.required),
    // description: new FormControl("", Validators.required),
    displayOrder: new UntypedFormControl("", Validators.required),
    content: new UntypedFormControl(""),
    html: new UntypedFormControl(""),
  });

  base64textString: string = "";
  imgSrc: string = "";

  // get Name() {
  //   return this.sliderForm.get("name");
  // }

  // get Description() {
  //   return this.sliderForm.get("description");
  // }

  get DisplayOrder() {
    return this.sliderForm.get("displayOrder");
  }

  get Content() {
    return this.sliderForm.get("content");
  }

  get Html() {
    return this.sliderForm.get("html");
  }

  editSlider: any | undefined;

  permissionList = new Array();

  constructor(private routes: ActivatedRoute, private sliderService: SliderService, private dialog: MatDialog, private router: Router) {
    this.routes.params.subscribe(param => {
      this.editId = param['data'];
      (this.editId != undefined) ? this.screenName = "Edit Slider" : this.screenName = "New Slider";
      console.log(this.editId);

      if (this.editId != undefined && this.editId != null) {
        this.getSlider();
      }

    });
  }

  ngOnInit(): void {
  }

  getSlider() {
    this.loading = true;
    this.sliderService.getSlider(this.editId).subscribe((response: any) => {
      console.log(response);
      this.loading = false;
      if (response != null) {
        this.editSlider = response;
        //this.Name?.setValue(this.editSlider.name);
        //this.Description?.setValue(this.editSlider.description);
        this.DisplayOrder?.setValue(this.editSlider.displayOrder);
        this.imgSrc = this.editSlider.imageBasePath + "2x/" +this.editSlider.imageURL;
        this.Content?.setValue(this.editSlider.content);
        this.Html?.setValue(this.editSlider.html);
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
    if (this.sliderForm.valid) {
      if (this.editId != undefined && this.editId != null) {
        this.editSlider.modifyBy = sessionStorage.getItem("user");
      } else {
        if(this.base64textString != ""){
          this.editSlider = new Object();
          this.editSlider.id = null;
          this.editSlider.createdBy = sessionStorage.getItem("user");
        }else{
          this.alert("Error", "Please upload an Image..", "error", "");
          return;
        }
        
      }
      //this.editSlider.name = this.Name?.value;
      this.editSlider.displayOrder = this.DisplayOrder?.value;
      //this.editSlider.description = this.Description?.value;
      this.editSlider.base64Image = this.base64textString;
      this.editSlider.content = this.Content?.value;
      this.editSlider.html = this.Html?.value;

      console.log(this.editSlider);
      this.loading = true;
      this.sliderService.saveSlider(this.editSlider).subscribe((response: any) => {
        this.loading = false;
        if (response.status == "200") {
          this.alert("Success", "Slider Saved Successfully..", "success", "");
          this.router.navigate(['home/slider']);
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

  selectFile(evt: any) {
    console.log(evt);
    var files = evt.target.files;
    var file = files[0];

    try{
      this.imgSrc = URL.createObjectURL(file);
    }catch{
      this.imgSrc = "";
    }
    
    if (files && file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt: any) {
    this.base64textString = readerEvt.target.result;
    console.log(this.base64textString);
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
