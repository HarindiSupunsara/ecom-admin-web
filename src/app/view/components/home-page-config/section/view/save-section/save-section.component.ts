import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { BrandService } from 'src/app/service/brand/brand.service';
import { CategoryService } from 'src/app/service/category/category.service';
import { ProductService } from 'src/app/service/product/product.service';
import { SectionService } from 'src/app/service/section/section.service';
import { AlertComponent } from 'src/app/view/core/alert/alert/alert.component';

@Component({
  selector: 'app-save-section',
  templateUrl: './save-section.component.html',
  styleUrls: ['./save-section.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
})
export class SaveSectionComponent implements OnInit {

  screenName: string = "";
  editId: string = "";
  layoutList = new Array();
  contentList = new Array();
  contentIdList = new Array();

  loading = false;

  sectionForm = new UntypedFormGroup({
    name: new FormControl("", Validators.required),
    title: new FormControl("", Validators.required),
    displayOrder: new FormControl("", Validators.required),
    layout: new FormControl("", Validators.required),
    contentType: new FormControl("", Validators.required),
  });

  sectionDataForm = new UntypedFormGroup({
    contentId: new FormControl("", Validators.required),
  });



  get Name() {
    return this.sectionForm.get("name");
  }

  get Title() {
    return this.sectionForm.get("title");
  }

  get DisplayOrder() {
    return this.sectionForm.get("displayOrder");
  }

  get Layout() {
    return this.sectionForm.get("layout");
  }

  get ContentType() {
    return this.sectionForm.get("contentType");
  }

  get ContentId() {
    return this.sectionDataForm.get("contentId");
  }

  editSection: any | undefined;

  filteredContents: Observable<any[]> | undefined;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement> | undefined;

  constructor(private routes: ActivatedRoute, private sectionService: SectionService, private dialog: MatDialog, private router: Router,
    private productService:ProductService,private categoryService:CategoryService,private brandService:BrandService) {
    this.routes.params.subscribe(param => {
      this.editId = param['data'];
      (this.editId != undefined) ? this.screenName = "Edit Section" : this.screenName = "New Section";
      console.log(this.editId);

      if (this.editId != undefined && this.editId != null) {
        this.getSection();
      }

    });
  }

  ngOnInit(): void {
    this.getAllLayouts();
    this.filteredContents = this.ContentId?.valueChanges.pipe(
      startWith(null),
      map((contents: any | null) => (contents ? this._filter(contents) : this.contentList.slice())),
    );
  }

  private _filter(value: any): any[] {
    console.log(value);
    const filterValue = value;

    return this.contentList.filter(cat => cat.name.includes(filterValue));
  }
  
  add(event: MatChipInputEvent): void {
    console.log(" Called ----");
    const value = (event.value || '').trim();

    const cat = this.contentList.find((f:any) => f.name == value);

    console.log(cat);

    // Add filter
    if (cat) {
      this.contentIdList.push(cat);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.ContentId?.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.contentIdList.indexOf(fruit);

    if (index >= 0) {
      this.contentIdList.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const cat = this.contentList.find((f:any) => f.name == event.option.viewValue);

    this.contentIdList.push(cat);
    this.filterInput!.nativeElement.value = "";
    this.ContentId?.setValue(null);
  }

  getAllLayouts(){
    this.loading = true;
    this.sectionService.getAllLayouts("ACTIVE").subscribe((response:any) => {
      this.loading = false;
      if(response){
        this.layoutList = response;
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

  loadContents(){
    console.log(this.ContentType?.value);
    this.contentList = new Array();
    switch (this.ContentType?.value) {
      case "ITEM":
        this.loading = true;
        this.productService.getAllActiveProduct("ACTIVE").subscribe(response => {
          this.loading = false;
          if(response){
            this.contentList = response;

            if(this.editSection != null && this.editSection.sectionDataResponseDtos != null){
              this.editSection.sectionDataResponseDtos.forEach((response : any)=> {
      
                let obj = this.contentList.find(c => c.id == response.contentId);
                
                this.contentIdList.push(obj);
              });
            }

          }
        });
        break;
      case "CATEGORY":
        this.loading = true;
        this.categoryService.getAllActiveCategory("ACTIVE",0).subscribe(response => {
          this.loading = false;
          if(response){
            this.contentList = response;

            if(this.editSection != null && this.editSection.sectionDataResponseDtos != null){
              this.editSection.sectionDataResponseDtos.forEach((response : any)=> {
      
                let obj = this.contentList.find(c => c.id == response.contentId);
                
                this.contentIdList.push(obj);
              });
            }

          }
        });
        break;
      case "BRAND":
        this.loading = true;
        this.brandService.getAllActiveBrand("ACTIVE").subscribe(response => {
          this.loading = false;
          if(response){
            this.contentList = response;

            if(this.editSection != null && this.editSection.sectionDataResponseDtos != null){
              this.editSection.sectionDataResponseDtos.forEach((response : any)=> {
      
                let obj = this.contentList.find(c => c.id == response.contentId);
                
                this.contentIdList.push(obj);
              });
            }

          }
        });
        break;
    
      default:
        break;
    }
  }

  getSection() {
    this.loading = true;
    this.sectionService.getSection(this.editId).subscribe((response: any) => {
      console.log(response);
      this.loading = false;
      if (response != null) {
        this.editSection = response;
        this.Name?.setValue(this.editSection.name);
        this.DisplayOrder?.setValue(this.editSection.displayOrder);
        this.Layout?.setValue(this.editSection.layoutDto.id);
        this.Title?.setValue(this.editSection.title);
        this.ContentType?.setValue(this.editSection.contentType);

      //   let contentType = "";

      //  if(this.editSection.sectionDataResponseDtos != null){
      //   contentType = this.editSection.sectionDataResponseDtos[0].contentType;
      //  }

      //  this.ContentType?.setValue(contentType);

       this.loadContents();

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
    if (this.sectionForm.valid) {
      let layName = this.layoutList.find(f => f.id == this.Layout?.value).name;
      console.log(layName);
      switch (this.ContentType?.value) {
        case "BRAND":
          if(layName == "SLIDER_GRID"){
            this.alert("Error", "Please select another layout..", "error", "");
            return;
          }
          break;

        case "CATEGORY":
          if(layName == "SLIDER_GRID"){
            this.alert("Error", "Please select another layout..", "error", "");
            return;
          }
          break;
      
        default:
          break;
      }
      if (this.editId != undefined && this.editId != null) {
        this.editSection.modifyBy = sessionStorage.getItem("user");
      } else {
        this.editSection = new Object();
        this.editSection.id = null;
        this.editSection.createdBy = sessionStorage.getItem("user");
      }

      this.editSection.displayOrder = this.DisplayOrder?.value;
      this.editSection.name = this.Name?.value;
      this.editSection.layoutId = this.Layout?.value;
      this.editSection.title = this.Title?.value;
      this.editSection.contentType = this.ContentType?.value;

      let sectionDataResponseDtos = new Array();

      console.log(this.contentIdList);

      if(this.contentIdList != null){
        this.contentIdList.forEach(c => {
          let obj = {
            // contentType : this.ContentType?.value,
            contentId: c.id
          }

          sectionDataResponseDtos.push(obj);
        });
      }

      this.editSection.sectionDataResponseDtos = sectionDataResponseDtos;

      console.log(this.editSection);
      this.loading = true;
      this.sectionService.saveSection(this.editSection).subscribe((response: any) => {
        this.loading = false;
        if (response.status == "200") {
          this.alert("Success", "Section Saved Successfully..", "success", "");
          this.router.navigate(['home/section']);
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
