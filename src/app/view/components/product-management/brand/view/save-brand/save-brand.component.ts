import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { map, Observable, startWith } from 'rxjs';
import { BrandService } from 'src/app/service/brand/brand.service';
import { AlertComponent } from 'src/app/view/core/alert/alert/alert.component';

@Component({
  selector: 'app-save-brand',
  templateUrl: './save-brand.component.html',
  styleUrls: ['./save-brand.component.scss']
})
export class SaveBrandComponent implements OnInit {

  CountryISO = CountryISO;

  screenName: string = "";
  editId: string = "";
  menuPermList = new Array();

  loading = false;

  brandForm = new UntypedFormGroup({
    name: new UntypedFormControl("", Validators.required),
    description: new UntypedFormControl("", Validators.required),
    displayOrder: new UntypedFormControl("", Validators.required),
    country: new UntypedFormControl(""),
  });

  base64textString: string = "";
  imgSrc: string = "";

  get Name() {
    return this.brandForm.get("name");
  }

  get Description() {
    return this.brandForm.get("description");
  }

  get DisplayOrder() {
    return this.brandForm.get("displayOrder");
  }

  get Country() {
    return this.brandForm.get("country");
  }

  editBrand: any | undefined;

  permissionList = new Array();

  countryList = new Array();
  countryCodes : any[] = new Array();

  filteredOptions: Observable<any[]> | undefined;

  constructor(private routes: ActivatedRoute, private brandService: BrandService, private dialog: MatDialog, private router: Router) {
    this.getCountries();
    this.routes.params.subscribe(param => {
      this.editId = param['data'];
      (this.editId != undefined) ? this.screenName = "Edit Brand" : this.screenName = "New Brand";
      console.log(this.editId);

      if (this.editId != undefined && this.editId != null) {
        this.getBrand();
      }

    });
  }

  ngOnInit(): void {

    let i = 0;
    this.countryCodes =  Object.values(CountryISO);
    for (const enumMember in CountryISO) {
      console.log(enumMember); 

      let  obj = {
        code: this.countryCodes[i],
        country: enumMember
      }

      this.countryList.push(obj);
      i++;
     
    }

    console.log(this.countryList);

    this.filteredOptions = this.Country?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: any): any[] {
    const filterValue = value;

    return this.countryList.filter(option => option.country.includes(filterValue));
  }

  getCountries(){
    this.loading = true;

    this.countryList = new Array();

    this.loading = false;
  }

  getBrand() {
    this.loading = true;
    this.brandService.getBrand(this.editId).subscribe((response: any) => {
      console.log(response);
      this.loading = false;
      if (response != null) {
        this.editBrand = response;
        this.Name?.setValue(this.editBrand.name);
        this.Description?.setValue(this.editBrand.description);
        this.DisplayOrder?.setValue(this.editBrand.displayOrder);
        this.imgSrc = this.editBrand.imageBasePath + "2x/" +this.editBrand.imageURL;
        this.Country?.setValue(this.editBrand.country);

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
    if (this.brandForm.valid) {
      if (this.editId != undefined && this.editId != null) {
        this.editBrand.modifyBy = sessionStorage.getItem("user");
      } else {
        if(this.base64textString != ""){
          this.editBrand = new Object();
          this.editBrand.id = null;
          this.editBrand.createBy = sessionStorage.getItem("user");
        }else{
          this.alert("Error", "Please upload an Image..", "error", "");
          return;
        }
        
      }
      this.editBrand.name = this.Name?.value;
      this.editBrand.displayOrder = this.DisplayOrder?.value;
      this.editBrand.description = this.Description?.value;
      this.editBrand.base64Image = this.base64textString;
      this.editBrand.country = this.Country?.value;

      this.editBrand.countryCode = this.countryList.find(c => c.country == this.Country?.value).code;

      console.log(this.editBrand);
      this.loading = true;
      this.brandService.saveBrand(this.editBrand).subscribe((response: any) => {
        this.loading = false;
        if (response.status == "200") {
          this.alert("Success", "Brand Saved Successfully..", "success", "");
          this.router.navigate(['home/brand']);
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
