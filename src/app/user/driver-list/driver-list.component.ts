import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { GlobalService } from '../../global/global.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {

  public data:any;
  submitted = false; 
  searchForm: FormGroup;
  httpOptions = {
    headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
  };
  constructor(private formBuilder: FormBuilder,private http: HttpClient, private router: Router,private ngFlashMessageService: NgFlashMessageService,private confirmationDialogService: ConfirmationDialogService,private global: GlobalService) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({ 
      full_name: [''],
      phone_number:[''] 
    });
    this.loadAllDriver();
  }

  private loadAllDriver(){   
    this.http.post('/api/user/driver/list',this.searchForm.value,this.httpOptions).subscribe(data => {
      this.data = data; 
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
    });
  }
  
  searchSubmit(){
    this.submitted = true;
    this.loadAllDriver();  
  }

  resetForm(){ 
    this.searchForm.setValue({
      full_name: '',
      phone_number:''
    }); 
    this.loadAllDriver();   
  }

  deleteDriver(id: number) {
    this.confirmationDialogService.confirm(this.global.CONFIRM_HEADER,this.global.DELETE_STATUS)
    .then(confirmed => {
      if(confirmed){
        this.http.get('/api/user/driver/delete/'+id,this.httpOptions).subscribe(data => {

          this.ngFlashMessageService.showFlashMessage({ 
            messages: ["Driver deleted successfully"],  
            dismissible: true,  
            timeout: false, 
            type: 'success'
          });

          this.loadAllDriver();
        }, err => {
          if(err.status === 401) {
            this.router.navigate(['login']);
          }
        })
      }
     }
    ); 
  }

  updateStatus(id: number,status:number) {  
    this.confirmationDialogService.confirm(this.global.CONFIRM_HEADER,this.global.UPDATE_STATUS)
    .then(confirmed => {
      if(confirmed){
        this.http.get('/api/user/driver/status/'+id+'/'+status,this.httpOptions).subscribe(data => {
            
          this.ngFlashMessageService.showFlashMessage({ 
            messages: [this.global.SUCCESS_STATUS_MSG],  
            dismissible: true,  
            timeout: false, 
            type: 'success'
          });

          this.loadAllDriver();
        }, err => {
          if(err.status === 401) {
            this.router.navigate(['login']);
          }
        })  
        }
      }
    ); 
  }

  approveDriverStatus(id: number,status:number) {  
    this.confirmationDialogService.confirm(this.global.CONFIRM_HEADER,"Do you really want to change document status ?")
    .then(confirmed => {
      if(confirmed){
        this.http.get('/api/user/driver/approve-status/'+id+'/'+status,this.httpOptions).subscribe(data => {
            
          this.ngFlashMessageService.showFlashMessage({ 
            messages: [this.global.SUCCESS_STATUS_MSG],  
            dismissible: true,  
            timeout: false, 
            type: 'success'
          });

          this.loadAllDriver();
        }, err => {
          if(err.status === 401) {
            this.router.navigate(['login']);
          }
        })  
        }
      }
    ); 
  }

}
