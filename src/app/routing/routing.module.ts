import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BookComponent } from '../book/book.component';
import { AuthGuard } from '../auth/auth.guard';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { UserListComponent } from '../user/user-list/user-list.component';
import { UserAddComponent } from '../user/user-add/user-add.component';
import { UserViewComponent } from '../user/user-view/user-view.component';
import { UserEditComponent } from '../user/user-edit/user-edit.component';
import { CarModelListComponent } from '../carModel/car-model-list/car-model-list.component';
import { CarModelAddComponent } from '../carModel/car-model-add/car-model-add.component';
import { CarModelEditComponent } from '../carModel/car-model-edit/car-model-edit.component';
import { DriverListComponent } from '../user/driver-list/driver-list.component';
import { DriverAddComponent } from '../user/driver-add/driver-add.component';
import { DriverEditComponent } from '../user/driver-edit/driver-edit.component';
import { DriverViewComponent } from '../user/driver-view/driver-view.component';
import { LanguageListComponent } from '../language/language-list/language-list.component';
import { LanguageAddComponent } from '../language/language-add/language-add.component';
import { LanguageEditComponent } from '../language/language-edit/language-edit.component';
import { MultilangListComponent } from '../multilang/multilang-list/multilang-list.component';
import { MultilangAddComponent } from '../multilang/multilang-add/multilang-add.component';
import { OfferViewComponent } from '../offer/offer-view/offer-view.component';
import { OfferListComponent } from '../offer/offer-list/offer-list.component';
import { LanguageSettingAddComponent } from '../languageSetting/language-setting-add/language-setting-add.component';
import { LanguageSettingListComponent } from '../languageSetting/language-setting-list/language-setting-list.component';
import { CmspageListComponent } from '../cmspage/cmspage-list/cmspage-list.component';
import { CmspageAddComponent } from '../cmspage/cmspage-add/cmspage-add.component';


const appRoutes: Routes = [
  {
    path: 'books',component: BookComponent,canActivate: [AuthGuard],data: { title: 'Book List' }
  },
  { path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard] },
 
  /* passenger routing*/
  { path: 'users/passenger', component: UserListComponent,canActivate: [AuthGuard] }, 
  { path: 'users/passenger/add', component: UserAddComponent,canActivate: [AuthGuard] },
  { path: 'users/passenger/edit/:id', component: UserEditComponent,canActivate: [AuthGuard] },
  { path: 'users/passenger/view/:id', component: UserViewComponent,canActivate: [AuthGuard] },
  /* passenger routing*/
 
  /* driver routing*/
  { path: 'users/driver', component: DriverListComponent,canActivate: [AuthGuard] }, 
  { path: 'users/driver/add', component: DriverAddComponent,canActivate: [AuthGuard] },
  { path: 'users/driver/edit/:id', component: DriverEditComponent,canActivate: [AuthGuard] },
  { path: 'users/driver/view/:id', component: DriverViewComponent,canActivate: [AuthGuard] },
  /* driver routing*/

  /*car model and color routing*/
  { path: 'car-model', component: CarModelListComponent,canActivate: [AuthGuard] }, 
  { path: 'car-model/add', component: CarModelAddComponent,canActivate: [AuthGuard] },
  { path: 'car-model/edit/:id', component: CarModelEditComponent,canActivate: [AuthGuard] }, 
  /*car model and color routing*/

  /*car model and color routing*/
  { path: 'language', component: LanguageListComponent,canActivate: [AuthGuard] }, 
  { path: 'language/add', component: LanguageAddComponent,canActivate: [AuthGuard] },
  { path: 'language/edit/:id', component: LanguageEditComponent,canActivate: [AuthGuard] }, 
  /*car model and color routing*/

  /*multi routing*/
  { path: 'multi', component: MultilangListComponent,canActivate: [AuthGuard] }, 
  { path: 'multi/add', component: MultilangAddComponent,canActivate: [AuthGuard] }, 
  /*multi routing*/

  /*multi routing*/
  { path: 'language-settings', component: LanguageSettingListComponent,canActivate: [AuthGuard] }, 
  { path: 'language-settings/add', component: LanguageSettingAddComponent,canActivate: [AuthGuard] }, 
  /*multi routing*/

  /*offer routing*/
  { path: 'offer', component: OfferListComponent,canActivate: [AuthGuard] }, 
  { path: 'offer/view/:id', component: OfferViewComponent,canActivate: [AuthGuard] }, 
  /*offer routing*/

  /*cms page routing*/
  { path: 'cms-page', component: CmspageListComponent,canActivate: [AuthGuard] }, 
  { path: 'cms-page/add', component: CmspageAddComponent,canActivate: [AuthGuard] }, 
  /*cms page routing*/

  { path: 'login', component: LoginComponent,  data: { title: 'Login' } },
  { path: 'signup', component: SignupComponent,  data: { title: 'Sign Up' } },

  /* { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  } */

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, {
      onSameUrlNavigation: 'reload',enableTracing: true,useHash: false
    }) 
  ],
  declarations: [],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RoutingModule { }
