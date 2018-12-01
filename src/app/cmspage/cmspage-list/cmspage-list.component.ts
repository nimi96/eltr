import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms'; 
import { GlobalService } from '../../global/global.service';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { NgFlashMessageService } from 'ng-flash-messages';

@Component({
  selector: 'app-cmspage-list',
  templateUrl: './cmspage-list.component.html',
  styleUrls: ['./cmspage-list.component.css']
})
export class CmspageListComponent implements OnInit {

  submitted = false;
  result: any;
  data: any;
  carUrl: string;
  searchForm: FormGroup;
  httpOptions = {
    headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
  };
  constructor(private formBuilder: FormBuilder,private http: HttpClient, private router: Router,private ngFlashMessageService: NgFlashMessageService,private confirmationDialogService: ConfirmationDialogService,private global: GlobalService) { }

  ngOnInit(){
    this.searchForm = this.formBuilder.group({ 
      name: [''],
      page:[1] 
    });
    this.loadAllCmsPage();
    this.carUrl = 'api/car-model/list';
  }

  private loadAllCmsPage(){ 
    this.http.post('/api/cms-pages/list',this.searchForm.value, this.httpOptions).subscribe(data => {
      this.data = data; 
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

  searchSubmit(){
    this.submitted = true;
    this.loadAllCmsPage();  
  }

  resetForm(){ 
    this.searchForm.setValue({
      name: '',
      page:1
    }); 
    this.loadAllCmsPage();   
  }

  getRecords(data){ 
    this.result = data; 
  }
  
  /* deleteCarModel(id: number) {
    this.confirmationDialogService.confirm(this.global.CONFIRM_HEADER,this.global.DELETE_STATUS)
    .then(confirmed => {
        if(confirmed){
          this.http.get('/api/car-model/delete/'+id,this.httpOptions).subscribe(data => {
    
            this.ngFlashMessageService.showFlashMessage({ 
              messages: ["Car model deleted successfully"],  
              dismissible: true,  
              timeout: false, 
              type: 'success'
            });
    
            this.loadAllCmsPage();
          }, err => {
            if(err.status === 401) {
              this.router.navigate(['login']);
            }
          })
        }
      }
    ); 
  } */

  /* updateStatus(id: number,status:number) {  
    var error = 0;
    this.confirmationDialogService.confirm(this.global.CONFIRM_HEADER,this.global.UPDATE_STATUS)
    .then(confirmed => {
      if(confirmed){
        this.http.get('/api/car-model/status/'+id+'/'+status,this.httpOptions).subscribe(data => {
        
          this.ngFlashMessageService.showFlashMessage({ 
            messages: [this.global.SUCCESS_STATUS_MSG],  
            dismissible: true,  
            timeout: false, 
            type: 'success'
          });
    
          this.loadAllCmsPage();
        }, err => {
          if(err.status === 401) {
            this.router.navigate(['login']);
          }
        }) 
      }
    }  
    ); 
  } */

}
