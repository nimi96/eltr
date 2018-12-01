import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  readonly projectName: string = 'Eltar'; 
  readonly adminName: string = 'Admin'; 
  readonly CONFIRM_HEADER: string = 'Please confirm..'; 
  readonly DELETE_STATUS: string = 'Do you really want to delete this ?'; 
  readonly UPDATE_STATUS: string = 'Do you really want to change status ?'; 
  readonly SUCCESS_STATUS_MSG: string = 'Status updated successfully.';  
  //readonly BASEURL: string                          = "http://eltar.stage02.obdemo.com/";  
  readonly BASEURL: string                          = "http://localhost:3000/";  
  readonly APP_IMAGE_ROOT_PATH: string			        =  this.BASEURL + 'uploads/';  
  readonly PROFILE_IMAGE_ROOT_PATH: string          =  this.APP_IMAGE_ROOT_PATH + 'profile/'; 
  readonly DOCUMENT_IMAGE_ROOT_PATH: string         =  this.APP_IMAGE_ROOT_PATH + 'document/'; 
  readonly LICENCE_IMAGE_ROOT_PATH: string          =  this.APP_IMAGE_ROOT_PATH + 'licence/'; 

  constructor() { }
}
