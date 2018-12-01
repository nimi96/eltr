import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first } from 'rxjs/operators';


interface IDay {
  name: string;
  value: string;
}
interface BDay {
  langname: string;
  value: string;
}

@Component({
  selector: 'app-multilang-add',
  templateUrl: './multilang-add.component.html',
  styleUrls: ['./multilang-add.component.css']
})

export class MultilangAddComponent implements OnInit {

  public detailsForm: FormGroup;
  submitted = false;
  currenttab:string;
  message: any; 
  record:any;
  lanArr = [];
  public title: IDay[] = []; 
  public description: BDay[] = [];
  public langArray = [];
  constructor( 
    private formBuilder: FormBuilder,   
    private router: Router,   
    private http: HttpClient,
  ) { }

  ngOnInit() { 
      //create detailsForm FormGroup using FormBuilder's short-hand syntax
      this.detailsForm = this.formBuilder.group({
      });  
        
    var result  = [];
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.post('/api/language/list',{'page':1}, httpOptions).pipe(first()).subscribe(data => { 
      if(!data){
        this.router.navigate(['language']);
      } 
      this.record   = data; 
      result = this.langArray =  Object.keys(this.record.docs).map(key => ({type: key, value: this.record.docs[key]}));  
      result.forEach(element => {  
        this.currenttab = element.value.name;
        this.title.push({value:element.value.lang_code, name:element.value.name});
        this.description.push({value:element.value.lang_code, langname:element.value.name});
      });  

      let daysFormGroup: FormGroup = new FormGroup({});
      for (let day of this.title) {
        let control: FormControl = new FormControl(day.value, Validators.required);
        daysFormGroup.addControl(day.value, control); 
      } 
      
      let bodyFormGroup: FormGroup = new FormGroup({});
      for (let rec of this.description) {
        let control1: FormControl = new FormControl(rec.value, Validators.required); 
        bodyFormGroup.addControl(rec.value, control1);
      } 

      //create detailsForm FormGroup using FormBuilder's short-hand syntax
      this.detailsForm = this.formBuilder.group({
        name: ["", Validators.required], 
        title: daysFormGroup,
        body: bodyFormGroup 
      });  
         
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['language']);
      }
    }); 
  } 

 // get f() { return this.carForm.controls; }  

  onSubmit() {
    this.submitted = true; 
    // stop here if form is invalid
    if (this.detailsForm.invalid) {
        return;
    }
    if (this.detailsForm.valid) {
      console.log(this.detailsForm.value)  
      
      let httpOptions = {
        headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
      };
      this.http.post('/api/cms-pages/save',this.detailsForm.value,httpOptions)
        .subscribe(
        data => { 
          if(data['success'] == false){
            this.message = {'text': data['msg'],type:'error'};  
          }else{
            this.router.navigate(['multi']);  
          }
        },
        err => {
          this.message = err.error.msg;
        }
      );
    }
  }

  currentTab(name: any){
    this.currenttab = name;
  }
}
