import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { Router } from '@angular/router'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-language-add',
  templateUrl: './language-add.component.html',
  styleUrls: ['./language-add.component.css']
})
export class LanguageAddComponent implements OnInit {

  addForm: FormGroup; 
  submitted = false;
  message: any;

  constructor( 
    private formBuilder: FormBuilder, 
    private router: Router,   
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      lang_code: ['',Validators.required] 
    });
  }

  get f() { return this.addForm.controls; }

  onSubmit() {
    this.submitted = true; 
    // stop here if form is invalid
    if (this.addForm.invalid) {
        return;
    }
    if (this.addForm.valid) {
      let httpOptions = {
        headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
      };
      this.http.post('/api/language/save',this.addForm.value,httpOptions)
        .subscribe(
        data => { 
          if(data['success'] == false){
            this.message = {'text': data['msg'],type:'error'};    
          }else{
            this.router.navigate(['language']);  
          }
        },
        err => {
          this.message = err.error.msg;
        }
      );
    }
  }
}
