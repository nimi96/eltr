import { Component, OnInit, NgModule, Input, Output } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'; 
import { first } from 'rxjs/operators'; 
import { NgFlashMessageService } from 'ng-flash-messages'; 
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { GlobalService } from '../../global/global.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
}) 

export class UserListComponent implements OnInit {
 
  public data:any;
  submitted = false;
  result  = [];
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
    this.loadAllPassenger();
  }

  private loadAllPassenger(){  
    this.http.post('/api/user/passenger/list',this.searchForm.value, this.httpOptions).pipe(first()).subscribe(data => { 
      this.data =  data;  
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
    }); 
  }

  searchSubmit(){
    this.submitted = true;
    this.loadAllPassenger();  
  }

  resetForm(){ 
    this.searchForm.setValue({
      full_name: '',
      phone_number:''
    }); 
    this.loadAllPassenger();   
  }

  deletePassenger(id: number) {
    this.confirmationDialogService.confirm(this.global.CONFIRM_HEADER,this.global.DELETE_STATUS)
    .then(confirmed => {
      if(confirmed){
        this.http.get('/api/user/passenger/delete/'+id,this.httpOptions).subscribe(data => {

          this.ngFlashMessageService.showFlashMessage({ 
            messages: ["Passenger deleted successfully"],  
            dismissible: true,  
            timeout: false, 
            type: 'success'
          });

          this.loadAllPassenger();
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
        this.http.get('/api/user/passenger/status/'+id+'/'+status,this.httpOptions).subscribe(data => {
            
          this.ngFlashMessageService.showFlashMessage({ 
            messages: [this.global.SUCCESS_STATUS_MSG],  
            dismissible: true,  
            timeout: false, 
            type: 'success'
          });

          this.loadAllPassenger();
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
