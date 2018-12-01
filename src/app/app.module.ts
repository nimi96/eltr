import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {DataTableModule} from "angular-6-datatable"; 
import { NgFlashMessagesModule } from 'ng-flash-messages';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { BookComponent } from './book/book.component';

import { RouterModule, Routes, NavigationEnd } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoutingModule } from './routing/routing.module'; 
import { UserListComponent } from './user/user-list/user-list.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserViewComponent } from './user/user-view/user-view.component';
import { CarModelListComponent } from './carModel/car-model-list/car-model-list.component';
import { CarModelAddComponent } from './carModel/car-model-add/car-model-add.component';
import { CarModelEditComponent } from './carModel/car-model-edit/car-model-edit.component';
import { DriverAddComponent } from './user/driver-add/driver-add.component';
import { DriverEditComponent } from './user/driver-edit/driver-edit.component';
import { DriverViewComponent } from './user/driver-view/driver-view.component';
import { DriverListComponent } from './user/driver-list/driver-list.component';
import { PaginationComponent } from './pagination/pagination.component';
import { LanguageAddComponent } from './language/language-add/language-add.component';
import { LanguageEditComponent } from './language/language-edit/language-edit.component';
import { LanguageListComponent } from './language/language-list/language-list.component';
import { MultilangAddComponent } from './multilang/multilang-add/multilang-add.component';
import { MultilangListComponent } from './multilang/multilang-list/multilang-list.component';
import { OfferListComponent } from './offer/offer-list/offer-list.component';
import { OfferViewComponent } from './offer/offer-view/offer-view.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';
import { LanguageSettingListComponent } from './languageSetting/language-setting-list/language-setting-list.component';
import { LanguageSettingAddComponent } from './languageSetting/language-setting-add/language-setting-add.component';
import { CmspageListComponent } from './cmspage/cmspage-list/cmspage-list.component';
import { CmspageAddComponent } from './cmspage/cmspage-add/cmspage-add.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    BookComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    DashboardComponent, 
    UserListComponent, UserAddComponent, UserEditComponent, UserViewComponent, CarModelListComponent, CarModelAddComponent, CarModelEditComponent, DriverAddComponent, DriverEditComponent, DriverViewComponent, DriverListComponent, PaginationComponent, LanguageAddComponent, LanguageEditComponent, LanguageListComponent, MultilangAddComponent, MultilangListComponent, OfferListComponent, OfferViewComponent, ConfirmationDialogComponent, LanguageSettingListComponent, LanguageSettingAddComponent, CmspageListComponent, CmspageAddComponent 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,  
    RoutingModule,
    ReactiveFormsModule,
    DataTableModule,
    NgFlashMessagesModule.forRoot(), 
    NgbModule.forRoot()
  ],
  exports: [RouterModule],
  providers: [ConfirmationDialogService],
  bootstrap: [AppComponent],
  entryComponents: [ ConfirmationDialogComponent ],
})
export class AppModule { 
}
