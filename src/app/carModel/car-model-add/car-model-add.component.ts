import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../data/data.service'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-car-model-add',
  templateUrl: './car-model-add.component.html',
  styleUrls: ['./car-model-add.component.css']
})
export class CarModelAddComponent implements OnInit {

  carForm: FormGroup; 
  submitted = false;
  message: any;

  constructor( 
    private formBuilder: FormBuilder, 
    private router: Router,  
    private dataS: DataService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.carForm = this.formBuilder.group({
      name: ['', Validators.required],
      qty_of_passenger: ['', [Validators.required,Validators.pattern('[0-9]*')]] 
    });
  }

  get f() { return this.carForm.controls; }

  onSubmit() {
    this.submitted = true; 
    // stop here if form is invalid
    if (this.carForm.invalid) {
        return;
    }
    if (this.carForm.valid) {
      let httpOptions = {
        headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
      };
      this.http.post('/api/car-model/save',this.carForm.value,httpOptions)
        .subscribe(
        data => { 
          if(data['success'] == false){
            this.message = {'text': data['msg'],type:'error'};    
          }else{
            this.router.navigate(['car-model']);  
          }
        },
        err => {
          this.message = err.error.msg;
        }
      );
    }
  }
}
