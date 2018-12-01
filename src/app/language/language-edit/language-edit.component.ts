import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-language-edit',
  templateUrl: './language-edit.component.html',
  styleUrls: ['./language-edit.component.css']
})
export class LanguageEditComponent implements OnInit {

  editForm: FormGroup; 
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
    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      lang_code: ['', Validators.required] 
    });

    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.get('/api/language/edit/'+this.id, httpOptions).subscribe(data => { 
      if(!data){
        this.router.navigate(['language']);
      }
      this.result = data;   
      this.editForm.setValue({
        name: this.result.name,
        lang_code: this.result.lang_code 
      }); 
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['language']);
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
      this.http.post('/api/language/update/'+this.id,this.editForm.value,httpOptions)
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
