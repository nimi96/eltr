import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgFlashMessageService } from 'ng-flash-messages';

@Component({
  selector: 'app-driver-add',
  templateUrl: './driver-add.component.html',
  styleUrls: ['./driver-add.component.css']
})
export class DriverAddComponent implements OnInit {

  userForm: FormGroup; 
  submitted = false;
  message: any;    
  carModelList: any;    

  constructor( 
    private formBuilder: FormBuilder, 
    private router: Router,   
    private http: HttpClient,
    private ngFlashMessageService: NgFlashMessageService
  ) { }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      full_name: ['', Validators.required], 
      phone_number: ['', [Validators.required,Validators.pattern('[0-9]*')]],
      car_model_id: [null, Validators.required], 
      qty_of_passenger: ['', [Validators.required,Validators.pattern('[0-9]*')]],
      car_number: ['', Validators.required]
    });
    
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.get('/api/car-model/car-model-list', httpOptions).subscribe(data => {
      if(!data){
        this.router.navigate(['users/driver']);
      }  
      this.carModelList = data;    
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['users/driver']);
      }
    }); 
  }

  get f() { return this.userForm.controls; }

  onSubmit() {
    this.submitted = true; 
    
    // stop here if form is invalid
    if (this.userForm.invalid) {
        return;
    }
    if (this.userForm.valid) {
      let httpOptions = {
        headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
      };
      this.http.post('/api/user/driver/save',this.userForm.value,httpOptions)
        .subscribe(
        data => { 
          if(data['success'] == false){  
          }else{
            this.router.navigate(['users/driver']);  
          }
        },
        err => { 
          this.ngFlashMessageService.showFlashMessage({ 
            messages: [err.error.msg],  
            dismissible: true,  
            timeout: false, 
            type: 'danger'
          });  
        }
      );
    }
  }
}
