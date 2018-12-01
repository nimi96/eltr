import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgFlashMessageService } from 'ng-flash-messages';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  editForm: FormGroup;
  result: any;
  id: any;
  message: any;   
  submitted = false;

  constructor(
    private formBuilder: FormBuilder, private route: ActivatedRoute,private http: HttpClient, private router: Router,
    private ngFlashMessageService: NgFlashMessageService) {
    this.route.params.subscribe( params => this.id = params.id );
   }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      full_name: ['', Validators.required],
      phone_number: ['', [Validators.required,Validators.pattern('[0-9]*')]] 
    });

    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.get('/api/user/passenger/edit/'+this.id, httpOptions).subscribe(data => {
      if(!data){
        this.router.navigate(['users/passenger']);
      }  
      this.result = data;   
      this.editForm.setValue({
        full_name: this.result.full_name, 
        phone_number: this.result.phone_number
      }); 
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['users/passenger']);
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
      this.http.post('/api/user/passenger/update/'+this.id,this.editForm.value,httpOptions)
        .subscribe(
        data => { 
          if(data['success'] == false){
            this.message = {'text': "Invalid detail.",type:'error'};    
          }else{
            this.router.navigate(['users/passenger']);  
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
