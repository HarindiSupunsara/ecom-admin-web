import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { BrandService } from 'src/app/service/brand/brand.service';
import { CategoryService } from 'src/app/service/category/category.service';
import { ProductService } from 'src/app/service/product/product.service';
import { AlertComponent } from 'src/app/view/core/alert/alert/alert.component';

@Component({
  selector: 'app-save-product',
  templateUrl: './save-product.component.html',
  styleUrls: ['./save-product.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
})
export class SaveProductComponent implements OnInit {

  screenName: string = "";
  editId: string = "";
  menuPermList = new Array();

  loading = false;

  productFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl("", Validators.required),
    description: new UntypedFormControl("", Validators.required),
    displayOrder: new UntypedFormControl("", Validators.required),
    brand: new UntypedFormControl("", Validators.required),
    category: new UntypedFormControl("", Validators.required),
    qoh: new UntypedFormControl("", Validators.required),
    price: new UntypedFormControl(""),
    show: new UntypedFormControl(false),
    catalogueLink: new UntypedFormControl(false),
    distype: new UntypedFormControl("", Validators.required),
    value: new UntypedFormControl("", Validators.required),
    activeDiscount: new UntypedFormControl(false),
  });

  filtersFormGroup  = new UntypedFormGroup({
    filters: new UntypedFormControl(""),
    filterValue: new UntypedFormControl(""),
    dataString: new UntypedFormControl(""),
  });

  imageFormGroup  = new UntypedFormGroup({
    displayOrder: new UntypedFormControl("", Validators.required),
    type: new UntypedFormControl("", Validators.required)
  });

  base64textString: string = "";
  imgSrc: string = "";
  pdfFile: File | undefined;

  get DiscountType() {
    return this.productFormGroup.get("distype");
  }

  get Value() {
    return this.productFormGroup.get("value");
  }

  get ActiveDiscont() {
    return this.productFormGroup.get("activeDiscount");
  }

  get Name() {
    return this.productFormGroup.get("name");
  }

  get Description() {
    return this.productFormGroup.get("description");
  }

  get DisplayOrder() {
    return this.productFormGroup.get("displayOrder");
  }

  get Brand() {
    return this.productFormGroup.get("brand");
  }

  get Qoh() {
    return this.productFormGroup.get("qoh");
  }

  get Category() {
    return this.productFormGroup.get("category");
  }

  get Price() {
    return this.productFormGroup.get("price");
  }

  get Show() {
    return this.productFormGroup.get("show");
  }

  get CatalogueLink(){
    return this.productFormGroup.get("catalogueLink");
  }

  get Filters() {
    return this.filtersFormGroup.get("filters");
  }

  get FilterValue() {
    return this.filtersFormGroup.get("filterValue");
  }

  get DataString() {
    return this.filtersFormGroup.get("dataString");
  }

  get Type() {
    return this.imageFormGroup.get("type");
  }

  get ImageDisOrder() {
    return this.imageFormGroup.get("displayOrder");
  }

  editProduct: any | undefined;

  permissionList = new Array();

  filteredFilters: Observable<any[]> | undefined;
  categoryFilters: any[] = new Array();
  filterList: any[] = new Array();

  categoryList = new Array();
  brandList = new Array();

  @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement> | undefined;

  displayedColumns : string[] = ['name','data','status','edit'];

  private _editFilter: any = null;

  private _editImage: any = null;

  imageList = new Array();

  constructor(private routes: ActivatedRoute, private categoryService: CategoryService, private brandService: BrandService, private productService: ProductService, private dialog: MatDialog, private router: Router) {
    this.getAllActiveCategory();
    this.routes.params.subscribe(param => {
      this.editId = param['data'];
      (this.editId != undefined) ? this.screenName = "Edit Product" : this.screenName = "New Product";
      console.log(this.editId);
    });
  }

  ngOnInit(): void {
  }

  getAllActiveBrands(){
    this.loading = true;
    this.brandList = new Array();
    this.brandService.getAllActiveBrand("ACTIVE").subscribe((response: any) => {
      console.log(response);
      this.loading = false;
      if (response != null) {
        this.brandList = response;
        if (this.editId != undefined && this.editId != null) {
          this.getProduct();
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

  getAllActiveCategory(){
    this.loading = true;
    this.categoryList = new Array();
    this.categoryService.getAllActiveCategory("ACTIVE",1).subscribe((response: any) => {
      console.log(response);
      if (response != null) {
        this.categoryList = response;
      }
      this.getAllActiveBrands();
    }, (error: { message: string; status: number }) => {
      this.loading = false;
      if (error.status == 401) {
        this.alert("Oopz..", "Your Session has expired.", "error", "");
      } else {
        this.alert("Failed", error.message, "error", "");
      }

    });
  }

  selectCategory(cat:any){

    let category = this.categoryList.find(c => c.id == cat.id);

    console.log(category);

    this.categoryFilters = category.filterDtos;

    this.filteredFilters = this.Filters?.valueChanges.pipe(
      startWith(null),
      map((catFilter: any | null) => (catFilter ? this._filter(catFilter) : this.categoryFilters.slice())),
    );

  }

  getProduct() {
    this.loading = true;
    this.productService.getProduct(this.editId).subscribe((response: any) => {
      console.log(response);
      this.loading = false;
      if (response != null) {
        this.editProduct = response;
        this.Name?.setValue(this.editProduct.name);
        this.Description?.setValue(this.editProduct.description);
        this.DisplayOrder?.setValue(this.editProduct.displayOrder);
        this.Qoh?.setValue(this.editProduct.quantityOnHand);
        this.Price?.setValue(this.editProduct.price);
        this.Show?.setValue(this.editProduct.showPrice == 1 ? true:false);
        this.ActiveDiscont?.setValue(this.editProduct.discountStatus == 1 ? true:false);
        this.DiscountType?.setValue(this.editProduct.discountType);
        this.Value?.setValue(this.editProduct.discountAmount);

        //this.imgSrc = this.editProduct.imageBasePath + "2x/" +this.editProduct.image_url;

        let catIdList = this.editProduct.categoryList.map((c:any) => c.id);
        this.Category?.setValue(catIdList);
        this.Brand?.setValue(this.editProduct.brand.id);
        this.CatalogueLink?.setValue(this.editProduct.catalogueLink);

        if(response.filterData != undefined && response.filterData != null){
          this.filterList = new Array();
          response.filterData.forEach((element:any) => {
            let catFil = {
              "id":element.id,
              "dataStr": element.dataStr,
              "dataDece": element.dataDece,
              "dataInt": element.dataInt,
              "filter": element.filter != undefined && element.filter != null && element.filter != 0 ?  this.categoryFilters.find(c => c.id == element.filter).name :  null,
              "status": 1,
            }

            this.filterList.push(catFil);
          });
        }

        if(response.imageList != undefined && response.imageList != null){
          this.imageList = new Array();
          response.imageList.forEach((element:any) => {
            let catFil = {
              "id":element.id,
              "order": element.order,
              "type": element.type,
              "imageString": element.imagePathPrefix+"3x/"+element.imageString,
              "status": element.status,
            }

            this.imageList.push(catFil);
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
    if (this.productFormGroup.valid) {
      if (this.editId != undefined && this.editId != null) {
        this.editProduct.modifyBy = sessionStorage.getItem("user");
      } else {
        // if(this.base64textString != ""){
          this.editProduct = new Object();
          this.editProduct.id = null;
          this.editProduct.createBy = sessionStorage.getItem("user");
        // }else{
        //   this.alert("Error", "Please upload an Image..", "error", "");
        //   return;
        // }
        
      }
      this.editProduct.name = this.Name?.value;
      this.editProduct.displayOrder = this.DisplayOrder?.value;
      this.editProduct.description = this.Description?.value;
      //this.editProduct.base64Image = this.base64textString;
      this.editProduct.categoryList = this.Category?.value;
      this.editProduct.brandId = this.Brand?.value;
      this.editProduct.quantityOnHand = this.Qoh?.value;
      this.editProduct.price = this.Price?.value;
      this.editProduct.showPrice = this.Show?.value == true ? 1:0;
      this.editProduct.catalogueLink = this.CatalogueLink?.value;
      this.editProduct.discountAmount = this.Value?.value;
      this.editProduct.discountStatus = this.ActiveDiscont?.value == true ? 1:0;
      this.editProduct.discountType = this.DiscountType?.value;

      let filList = new Array();

      if(this.filterList.length > 0){
        this.filterList.forEach((f:any) => {
          if(f.filter != null){
            let filt = this.categoryFilters.find(c => c.name == f.filter);
            // let fil = {
            //   "id":f.id,
            //   "dataStr": f.dataStr,
            //   "dataDece": f.dataDece,
            //   "dataInt": f.dataInt,
            //   "filter": f.filter,
            //   "status": f.status,
            // }

            let fil = JSON.parse(JSON.stringify(f));
            fil.filter = filt.id;
            filList.push(fil);
          }
        });
      }

      this.editProduct.filterData = filList;

      this.editProduct.imageList = this.imageList;

      console.log(this.editProduct);
      this.loading = true;
      this.productService.saveProduct(this.editProduct).subscribe((response: any) => {
        this.loading = false;
        if (response.status == "200") {
          this.alert("Success", "Product Saved Successfully..", "success", "");
          this.router.navigate(['home/product']);
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

  selectPdfFile(evt: any) {
    console.log(evt);
    var files = evt.target.files;
    this.pdfFile = files[0];
  }

  _handleReaderLoaded(readerEvt: any) {
    this.base64textString = readerEvt.target.result;
    console.log(this.base64textString);
  }

  private _filter(value: any): any[] {
    console.log(value);
    const filterValue = value;

    return this.categoryFilters.filter(cat => cat.name.includes(filterValue));
  }

  addToTable(){

    let isNew = false;

    let index = -1;

    if(this._editFilter == null){
      isNew = true;
      this._editFilter = new Object();
      this._editFilter.id = null;
      this._editFilter.status = 1;
    }else{
      index = this.filterList.indexOf(this._editFilter);
    }

    if(this.FilterValue?.value != undefined && this.FilterValue?.value != null && this.FilterValue?.value != ""){
      let filt = this.categoryFilters.find(f => f.name == this.Filters?.value);

      this._editFilter.filter = this.Filters?.value;

      switch (filt.type) {
        case "INTEGER":
          this._editFilter.dataInt = this.FilterValue?.value;
          break;

        case "DECIMAL":
          this._editFilter.dataDece = this.FilterValue?.value;
          break;

        case "TEXT":
          this._editFilter.dataStr = this.FilterValue?.value;
          break;
      
        default:
          break;
      }
    }else{
      this._editFilter.dataStr = this.DataString?.value;
      this._editFilter.dataInt = undefined;
      this._editFilter.dataDece = undefined;
      this._editFilter.filter = null;
    }

    if(isNew){
      this.filterList.push(this._editFilter);
    }else{
      this.filterList[index] = this._editFilter;
    }
    

    let list = this.filterList;

    this.filterList = new Array();

    list.forEach((f:any) =>{
      this.filterList.push(f);
    });


    this._editFilter = null;

    console.log(this.filterList);

    this.filtersFormGroup.reset();

  }

  changeFilterStatus(row:any,e:any){
    const index = this.filterList.indexOf(row);

    if (index >= 0) {
      this.filterList.splice(index, 1);
    }

    let list = this.filterList;

    this.filterList = new Array();

    list.forEach((f:any) =>{
      this.filterList.push(f);
    });

    console.log(this.filterList);
  }

  editFilter(row:any){

    this._editFilter = row;
    this.Filters?.setValue(row.filter);

    let filt = this.categoryFilters.find(f => f.name == this.Filters?.value);
    
    switch (filt.type) {
      case "INTEGER":
        this.FilterValue?.setValue(this._editFilter.dataInt);
        break;

      case "DECIMAL":
        this.FilterValue?.setValue(this._editFilter.dataDece);
        break;

      case "TEXT":
        this.FilterValue?.setValue(this._editFilter.dataStr);
        break;
    
      default:
        break;
    }

    this.DataString?.setValue(this._editFilter.dataStr);

  }

  addToImageList(){

    let isNew = false;

    let index = -1;

    if(this.imageFormGroup.valid){

      if(this._editImage == null){
        if(this.base64textString != null){
          isNew = true;
          this._editImage = new Object();
          this._editImage.id = null;
          this._editImage.status = "NEW";
          this._editImage.type = this.Type?.value;
          this._editImage.order = this.ImageDisOrder?.value;
          this._editImage.imageString = this.base64textString;
        }else{
          this.alert("Error", "Please upload an Image..", "error", "");
          return;
        }
      }else{
        index = this.imageList.indexOf(this._editImage);

        this._editImage.status = "EDIT";
        this._editImage.type = this.Type?.value;
        this._editImage.order = this.ImageDisOrder?.value;
      }

      if(isNew){

        let mainImg = this.imageList.find(i => i.type == 'MAIN');

        if(this._editImage.type == 'MAIN'){
          if(mainImg != null && mainImg != undefined){
            this.alert("Error", "Main type image is already exist..", "error", "");
            return;
          }else{
            this.imageList.push(this._editImage);
          }
        }else{
          this.imageList.push(this._editImage);
        }
      }else{
        let mainImg = this.imageList.find(i => i.type == 'MAIN');

        if(this._editImage.type == 'MAIN'){
          if(mainImg != null && mainImg != undefined && mainImg.order != this._editImage.order){
            this.alert("Error", "Main type image is already exist..", "error", "");
            return;
          }else{
            this.imageList[index] = this._editImage;
          }
        }else{
          this.imageList[index] = this._editImage;
        }
      }
      
  
      let list = this.imageList;
  
      this.imageList = new Array();
  
      list.forEach((f:any) =>{
        this.imageList.push(f);
      });
  
  
      this._editImage = null;
  
      console.log(this.imageList);
  
      this.imageFormGroup.reset();

      this.base64textString = "";

    }else{
      this.alert("Error", "Please Enter Image Data..", "error", "");
    }
  }

  editImageData(row:any){
    this._editImage = row;

    this.ImageDisOrder?.setValue(this._editImage.order);
    this.Type?.setValue(this._editImage.type);
  }

  removeImage(row:any){
    const index = this.imageList.indexOf(row);

    this.imageList[index].status = "REMOVE"
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
