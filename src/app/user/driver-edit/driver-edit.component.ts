import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgFlashMessageService } from 'ng-flash-messages';

@Component({
  selector: 'app-driver-edit',
  templateUrl: './driver-edit.component.html',
  styleUrls: ['./driver-edit.component.css']
})
export class DriverEditComponent implements OnInit {

  editForm: FormGroup;
  result: any;
  id: any;
  message: any;   
  carModelList: any;   
  submitted = false;

  constructor(
    private formBuilder: FormBuilder, private route: ActivatedRoute,private http: HttpClient, private router: Router,
    private ngFlashMessageService: NgFlashMessageService) {
    this.route.params.subscribe( params => this.id = params.id );
   }

  ngOnInit() { 
    this.editForm = this.formBuilder.group({
      full_name: ['', Validators.required], 
      phone_number: ['', [Validators.required,Validators.pattern('[0-9]*')]],
      car_model_id: [null, Validators.required], 
      qty_of_passenger: ['', [Validators.required,Validators.pattern('[0-9]*')]],
      car_number: ['', Validators.required]
    });

    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.get('/api/user/driver/edit/'+this.id, httpOptions).subscribe(data => {
      if(!data){
        this.router.navigate(['users/driver']);
      }  
      this.result = data;   
      this.editForm.setValue({
        full_name: this.result.full_name, 
        phone_number: this.result.phone_number,
        car_model_id: this.result.car_model_id._id,
        qty_of_passenger: this.result.qty_of_passenger,
        car_number: this.result.car_number
      }); 
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['users/driver']);
      }
    }); 
 
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

  get f() { return this.editForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editForm.invalid) {
        return;
    }
    if (this.editForm.valid) {
      let httpOptions = {
        headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
      };
      this.http.post('/api/user/driver/update/'+this.id,this.editForm.value,httpOptions)
        .subscribe(
        data => { 
          if(data['success'] == false){
            this.message = {'text': "Invalid detail.",type:'error'};    
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
