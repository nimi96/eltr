import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.css']
})
export class LanguageListComponent implements OnInit {

  submitted = false;
  result: any;
  carUrl: string;
  searchForm: FormGroup;
  httpOptions = {
    headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
  };
  constructor(private formBuilder: FormBuilder,private http: HttpClient, private router: Router) { }

  ngOnInit(){
    this.searchForm = this.formBuilder.group({ 
      name: [''],
      page:[1] 
    });
    this.loadAllLanguage();
    this.carUrl = 'api/language/list';
  }

  private loadAllLanguage(){ 
    this.http.post('/api/language/list',this.searchForm.value, this.httpOptions).subscribe(data => {
      this.result = data; 
      this.searchForm.patchValue({
        page: this.result.page,
      }); 
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
    });
  } 

  searchSubmit() {
    this.submitted = true;
    this.loadAllLanguage();  
  }

  getRecords(data){ 
    this.result = data; 
  }

  deleteLanguage(id: number) {
    this.http.get('/api/language/delete/'+id,this.httpOptions).subscribe(data => {
      this.loadAllLanguage();
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
    });
  }

  updateStatus(id: number,status:number) {
    this.http.get('/api/language/status/'+id+'/'+status,this.httpOptions).subscribe(data => {
      this.loadAllLanguage();
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
    });
  }

}
