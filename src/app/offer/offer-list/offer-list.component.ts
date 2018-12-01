import { Component, OnInit } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'; 
import { first } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { GlobalService } from '../../global/global.service';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.css']
})
export class OfferListComponent implements OnInit {

  public data:any;
  submitted = false; 
  searchForm: FormGroup;
  result  = [];
  httpOptions = {
    headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
  };

  constructor(private formBuilder: FormBuilder,private http: HttpClient, private router: Router,private confirmationDialogService: ConfirmationDialogService,private ngFlashMessageService: NgFlashMessageService,private global: GlobalService) { }
  
  ngOnInit() {
    this.searchForm = this.formBuilder.group({ 
      driver: [''],
      car_number:[''],
      car_model:[''] 
    });
    this.loadAllOffer();
  }

  searchSubmit(){
    this.submitted = true;
    this.loadAllOffer();  
  }

  resetForm(){ 
    this.searchForm.setValue({
      driver: '',
      car_number:'',
      car_model:''
    }); 
    this.loadAllOffer();   
  }
  
  private loadAllOffer(){  
    this.http.post('/api/offer/list',this.searchForm.value,this.httpOptions).pipe(first()).subscribe(data => { 
      this.data =  data;   
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
    }); 
  }

  updateStatus(id: number,status:number) {  
    this.confirmationDialogService.confirm(this.global.CONFIRM_HEADER,this.global.UPDATE_STATUS)
    .then(confirmed => {
      if(confirmed){
        this.http.get('/api/offer/update-status/'+id+'/'+status,this.httpOptions).subscribe(data => {
            
          this.ngFlashMessageService.showFlashMessage({ 
            messages: [this.global.SUCCESS_STATUS_MSG],  
            dismissible: true,  
            timeout: false, 
            type: 'success'
          });

          this.loadAllOffer();
        }, err => {
          if(err.status === 401) {
            this.router.navigate(['login']);
          }
        }) 
      }
    } 
    ); 
  }
}
