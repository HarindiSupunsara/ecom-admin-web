import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuardService } from './service/auth/auth-guard.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './view/core/alert/alert/alert.component';
import { ConfirmationAlertComponent } from './view/core/alert/confirmation-alert/confirmation-alert.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from './shared.module';
//import { MatCarouselModule } from '@ngmodule/material-carousel';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ChangePasswordAlertComponent } from './view/core/alert/change-password-alert/change-password-alert.component';
import { FileUploaderAlertComponent } from './view/core/alert/file-uploader-alert/file-uploader-alert.component';

@NgModule({
    declarations: [
        AppComponent,
        AlertComponent,
        ConfirmationAlertComponent,
        ChangePasswordAlertComponent,
        FileUploaderAlertComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatPaginatorModule,
        MatTableModule,
        MatSlideToggleModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        FlexLayoutModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatChipsModule,
        MatIconModule,
        SharedModule,
       // MatCarouselModule,
        // MatSelectCountryModule.forRoot('en'),
        // NgxFlagPickerModule,
        NgxIntlTelInputModule
    ],
    providers: [AuthGuardService],
    bootstrap: [AppComponent]
})
export class AppModule { }
