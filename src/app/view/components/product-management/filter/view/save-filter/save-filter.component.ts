import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterService } from 'src/app/service/filter/filter.service';
import { AlertComponent } from 'src/app/view/core/alert/alert/alert.component';

@Component({
  selector: 'app-save-filter',
  templateUrl: './save-filter.component.html',
  styleUrls: ['./save-filter.component.scss']
})
export class SaveFilterComponent implements OnInit {

  screenName: string = "";
  editId: string = "";
  menuPermList = new Array();

  loading = false;

  filterForm = new UntypedFormGroup({
    name: new UntypedFormControl("", Validators.required),
    type: new UntypedFormControl("", Validators.required),
    unit: new UntypedFormControl(""),
    show: new UntypedFormControl(false),
    displayOrder: new UntypedFormControl("", Validators.required)
  });

  get Name() {
    return this.filterForm.get("name");
  }

  get Type() {
    return this.filterForm.get("type");
  }

  get Unit() {
    return this.filterForm.get("unit");
  }

  get Show() {
    return this.filterForm.get("show");
  }

  get DisplayOrder() {
    return this.filterForm.get("displayOrder");
  }

  editFilter: any | undefined;

  permissionList = new Array();

  constructor(private routes: ActivatedRoute, private filterService: FilterService, private dialog: MatDialog, private router: Router) {
    this.routes.params.subscribe(param => {
      this.editId = param['data'];
      (this.editId != undefined) ? this.screenName = "Edit Filter" : this.screenName = "New Filter";
      console.log(this.editId);

      if (this.editId != undefined && this.editId != null) {
        this.getFilter();
      }

    });
  }

  ngOnInit(): void {
  }

  getFilter() {
    this.loading = true;
    this.filterService.getFilter(this.editId).subscribe((response: any) => {
      console.log(response);
      this.loading = false;
      if (response != null) {
        this.editFilter = response;
        this.Name?.setValue(this.editFilter.name);
        this.Type?.setValue(this.editFilter.type);
        this.Unit?.setValue(this.editFilter.unit);
        this.Show?.setValue(this.editFilter.showInMenu == 1 ? true:false);
        this.DisplayOrder?.setValue(this.editFilter.displayOrder);
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
    if (this.filterForm.valid) {
      if (this.editId != undefined && this.editId != null) {
        this.editFilter.modifyBy = sessionStorage.getItem("user");
      } else {
        this.editFilter = new Object();
        this.editFilter.id = null;
        this.editFilter.createBy = sessionStorage.getItem("user");
      }
      this.editFilter.name = this.Name?.value;
      this.editFilter.type = this.Type?.value;
      this.editFilter.unit = this.Unit?.value;
      this.editFilter.showInMenu = this.Show?.value == true ? 1:0;
      this.editFilter.displayOrder = this.DisplayOrder?.value;

      console.log(this.editFilter);
      this.loading = true;
      this.filterService.saveFilter(this.editFilter).subscribe((response: any) => {
        this.loading = false;
        if (response.status == "200") {
          this.alert("Success", "Filter Saved Successfully..", "success", "");
          this.router.navigate(['home/filter']);
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
