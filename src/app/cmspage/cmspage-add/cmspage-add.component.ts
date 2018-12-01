import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { NgFlashMessageService } from 'ng-flash-messages';

interface IDay {
  name: string;
  value: string;
}
interface BDay {
  langname: string;
  value: string;
}

@Component({
  selector: 'app-cmspage-add',
  templateUrl: './cmspage-add.component.html',
  styleUrls: ['./cmspage-add.component.css']
})
export class CmspageAddComponent implements OnInit {

  public addForm: FormGroup;
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
    private ngFlashMessageService: NgFlashMessageService
  ) { }

  ngOnInit() { 
      //create addForm FormGroup using FormBuilder's short-hand syntax
      this.addForm = this.formBuilder.group({
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
        this.title.push({value:'', name:element.value.name});
        this.description.push({value:'', langname:element.value.name});
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

      //create addForm FormGroup using FormBuilder's short-hand syntax
      this.addForm = this.formBuilder.group({
        name: ["", Validators.required], 
        title: daysFormGroup,
        body: bodyFormGroup 
      });  
         
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['cms-page']);
      }
    }); 
  } 

 // get f() { return this.carForm.controls; }  

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
      this.http.post('/api/cms-pages/save',this.addForm.value,httpOptions)
        .subscribe(
        data => { 
          if(data['success'] == false){
            this.message = {'text': data['msg'],type:'error'};  
          }else{
            this.router.navigate(['cms-page']);  
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

  currentTab(name: any){
    this.currenttab = name;
  }
}
