import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';  
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgFlashMessageService } from 'ng-flash-messages';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {

  userForm: FormGroup; 
  submitted = false;
  message: any;    

  constructor( 
    private formBuilder: FormBuilder, 
    private router: Router,   
    private http: HttpClient,
    private ngFlashMessageService: NgFlashMessageService
  ) { }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      full_name: ['', Validators.required], 
      phone_number: ['', [Validators.required,Validators.pattern('[0-9]*')]]
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
      this.http.post('/api/user/passenger/save',this.userForm.value,httpOptions)
        .subscribe(
        data => { 
          if(data['success'] == false){
            this.message = {'text': data['msg'],type:'error'};  
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
