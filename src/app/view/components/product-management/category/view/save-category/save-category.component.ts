import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/service/category/category.service';
import { AlertComponent } from 'src/app/view/core/alert/alert/alert.component';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { FilterService } from 'src/app/service/filter/filter.service';

@Component({
  selector: 'app-save-category',
  templateUrl: './save-category.component.html',
  styleUrls: ['./save-category.component.scss']
})
export class SaveCategoryComponent implements OnInit {

  screenName: string = "";
  editId: string = "";
  menuPermList = new Array();

  loading = false;

  categoryForm = new UntypedFormGroup({
    name: new UntypedFormControl("", Validators.required),
    description: new UntypedFormControl("", Validators.required),
    displayOrder: new UntypedFormControl("", Validators.required),
    parentCategory: new UntypedFormControl(""),
    categoryFilter: new UntypedFormControl(""),
  });

  base64textString: string = "";
  imgSrc: string = "";

  get Name() {
    return this.categoryForm.get("name");
  }

  get Description() {
    return this.categoryForm.get("description");
  }

  get DisplayOrder() {
    return this.categoryForm.get("displayOrder");
  }

  get ParentCategory() {
    return this.categoryForm.get("parentCategory");
  }

  get CategoryFilter() {
    return this.categoryForm.get("categoryFilter");
  }

  editCategory: any | undefined;

  permissionList = new Array();

  parentCategoryList = new Array();

  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredCategoryFilters: Observable<any[]> | undefined;
  categoryFilters: any[] = new Array();
  filterList: any[] = new Array();

  @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement> | undefined;

  constructor(private routes: ActivatedRoute, private categoryService: CategoryService, private filterService: FilterService, private dialog: MatDialog, private router: Router) {
    this.getAllActiveCategory();
    
    this.routes.params.subscribe(param => {
      this.editId = param['data'];
      (this.editId != undefined) ? this.screenName = "Edit Category" : this.screenName = "New Category";
      console.log(this.editId);


    });
  }

  ngOnInit(): void {
  }

  getAllActiveCategory(){
    this.loading = true;
    this.parentCategoryList = new Array();
    this.categoryService.getAllActiveCategory("ACTIVE",0).subscribe((response: any) => {
      console.log(response);
      this.loading = false;
      if (response != null) {
        this.parentCategoryList = response;
      }

      this.getAllActiveFilters();
    }, (error: { message: string; status: number }) => {
      this.loading = false;
      if (error.status == 401) {
        this.alert("Oopz..", "Your Session has expired.", "error", "");
      } else {
        this.alert("Failed", error.message, "error", "");
      }

    });
  }

  getAllActiveFilters(){
    this.loading = true;
    this.filterList = new Array();
    this.filterService.getAllActiveFilter("ACTIVE").subscribe((response: any) => {
      console.log(response);
      this.loading = false;
      if (response != null) {
        this.filterList = response;

        
      if (this.editId != undefined && this.editId != null) {
        this.getCategory();
      }
      
      }

      this.filteredCategoryFilters = this.CategoryFilter?.valueChanges.pipe(
        startWith(null),
        map((catFilter: any | null) => (catFilter ? this._filter(catFilter) : this.filterList.slice())),
      );
  
    }, (error: { message: string; status: number }) => {
      this.loading = false;
      if (error.status == 401) {
        this.alert("Oopz..", "Your Session has expired.", "error", "");
      } else {
        this.alert("Failed", error.message, "error", "");
      }

    });
  }

  getCategory() {
    this.loading = true;
    this.categoryService.getCategory(this.editId).subscribe((response: any) => {
      console.log(response);
      this.loading = false;
      if (response != null) {
        this.editCategory = response;
        this.Name?.setValue(this.editCategory.name);
        this.Description?.setValue(this.editCategory.description);
        this.DisplayOrder?.setValue(this.editCategory.displayOrder);
        this.imgSrc = this.editCategory.imageBasePath + "2x/" +this.editCategory.image_url;
        this.ParentCategory?.setValue(this.editCategory.parentId);

        if(response.filterDtos != undefined && response.filterDtos != null){
          this.categoryFilters = new Array();
          response.filterDtos.forEach((element:any) => {
            let catFil = {
              "id":element.id,
              "name": element.name,
              "type": element.type,
              "status": element.status,
            }

            this.categoryFilters.push(catFil);
          });
        }
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
    if (this.categoryForm.valid) {
      if (this.editId != undefined && this.editId != null) {
        this.editCategory.modifyBy = sessionStorage.getItem("user");
      } else {
        if(this.base64textString != ""){
          this.editCategory = new Object();
          this.editCategory.id = null;
          this.editCategory.createBy = sessionStorage.getItem("user");
        }else{
          this.alert("Error", "Please upload an Image..", "error", "");
          return;
        }
        
      }
      this.editCategory.name = this.Name?.value;
      this.editCategory.displayOrder = this.DisplayOrder?.value;
      this.editCategory.description = this.Description?.value;
      this.editCategory.base64Image = this.base64textString;
      this.editCategory.parentId = this.ParentCategory?.value;
      console.log(this.categoryFilters);
      const filterIds = this.categoryFilters.map((obj) => obj.id);

      this.editCategory.filterIds = filterIds;

      console.log(this.editCategory);
      this.loading = true;
      this.categoryService.saveCategory(this.editCategory).subscribe((response: any) => {
        this.loading = false;
        if (response.status == "200") {
          this.alert("Success", "Category Saved Successfully..", "success", "");
          this.router.navigate(['home/category']);
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


  add(event: MatChipInputEvent): void {
    console.log(" Called ----");
    const value = (event.value || '').trim();

    const cat = this.filterList.find(f => f.name == value);

    console.log(cat);

    // Add filter
    if (cat) {
      this.categoryFilters.push(cat);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.CategoryFilter?.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.categoryFilters.indexOf(fruit);

    if (index >= 0) {
      this.categoryFilters.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {

    const cat = this.filterList.find(f => f.name == event.option.viewValue);

    this.categoryFilters.push(cat);
    this.filterInput!.nativeElement.value = "";
    this.CategoryFilter?.setValue(null);
  }

  private _filter(value: any): any[] {
    console.log(value);
    const filterValue = value.name.toLowerCase();

    return this.filterList.filter(cat => cat.name.toLowerCase().includes(filterValue));
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
