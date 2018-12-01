import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router'; 
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { NgFlashMessageService } from 'ng-flash-messages';

interface IDay {
  name: string;
  value: string;
}
@Component({
  selector: 'app-language-setting-add',
  templateUrl: './language-setting-add.component.html',
  styleUrls: ['./language-setting-add.component.css']
})
export class LanguageSettingAddComponent implements OnInit {

  public addForm: FormGroup;
  submitted = false;
  public title: IDay[] = []; 
  record:any;
  lanArr = [];
  public langArray = [];
  httpOptions = {
    headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
  };
  constructor(
    private formBuilder: FormBuilder,   
    private router: Router,   
    private http: HttpClient,
    private ngFlashMessageService: NgFlashMessageService
  ) { }

  ngOnInit() {  
    this.addForm = this.formBuilder.group({ 
    });  
    var result  = []; 
    this.http.post('/api/language/list',{'page':1}, this.httpOptions).pipe(first()).subscribe(data => { 
      if(!data){
        this.router.navigate(['language']);
      } 
      this.record   = data; 
      result = this.langArray =  Object.keys(this.record.docs).map(key => ({type: key, value: this.record.docs[key]}));  
      result.forEach(element => {   
        this.title.push({value:element.value.lang_code, name:element.value.name}); 
      });  

      let daysFormGroup: FormGroup = new FormGroup({});
      for (let day of this.title) {
        let control: FormControl = new FormControl("", Validators.required);
        daysFormGroup.addControl(day.value, control); 
      }
       
      //create addForm FormGroup using FormBuilder's short-hand syntax
      this.addForm = this.formBuilder.group({
        name: ["", Validators.required], 
        title: daysFormGroup 
      });  
        
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['language']);
      }
    });
  }

  onSubmit() {
    this.submitted = true; 
    // stop here if form is invalid
    if (this.addForm.invalid) {
        return;
    }
    if (this.addForm.valid) { 
      this.http.post('/api/text-setting/save',this.addForm.value,this.httpOptions)
        .subscribe(
        data => {  
            this.router.navigate(['language-settings']);   
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
