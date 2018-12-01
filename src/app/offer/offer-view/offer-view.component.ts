import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../global/global.service';

@Component({
  selector: 'app-offer-view',
  templateUrl: './offer-view.component.html',
  styleUrls: ['./offer-view.component.css']
})
export class OfferViewComponent implements OnInit {

  result: Object;
  offerDetail: Object;
  id: any;
  PROFILE_IMAGE_ROOT_PATH: string;
  constructor(
    private route: ActivatedRoute,private http: HttpClient, private router: Router,private global: GlobalService) {
    this.route.params.subscribe( params => this.id = params.id );
   }

  ngOnInit(){
    this.PROFILE_IMAGE_ROOT_PATH  = this.global.PROFILE_IMAGE_ROOT_PATH;
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.get('/api/offer/view/'+this.id, httpOptions).subscribe(data => {
      var offerData = JSON.stringify(data);
      offerData = JSON.parse(offerData);  
      this.result = offerData['data'];
      this.offerDetail = offerData['orderData'];
      console.log(data)
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['offer']);
      }
    });
  }

}
