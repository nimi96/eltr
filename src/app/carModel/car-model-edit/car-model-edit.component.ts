import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-car-model-edit',
  templateUrl: './car-model-edit.component.html',
  styleUrls: ['./car-model-edit.component.css']
})
export class CarModelEditComponent implements OnInit {

  carForm: FormGroup; 
  submitted = false;
  message: any;
  result: any;
  id: any;

  constructor( 
    private formBuilder: FormBuilder, 
    private router: Router,   
    private http: HttpClient, 
    private route: ActivatedRoute,
  ) { this.route.params.subscribe( params => this.id = params.id );}

  ngOnInit() {
    this.carForm = this.formBuilder.group({
      name: ['', Validators.required],
      qty_of_passenger: ['', [Validators.required,Validators.pattern('[0-9]*')]] 
    });

    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.get('/api/car-model/edit/'+this.id, httpOptions).subscribe(data => { 
      if(!data){
        this.router.navigate(['car-model']);
      }
      this.result = data;   
      this.carForm.setValue({
        name: this.result.name,
        qty_of_passenger: this.result.qty_of_passenger 
      }); 
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['car-model']);
      }
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
      this.http.post('/api/car-model/update/'+this.id,this.carForm.value,httpOptions)
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
