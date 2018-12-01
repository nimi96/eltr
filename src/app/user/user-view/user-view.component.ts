import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../global/global.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {

  result: Object;
  id: any;
  PROFILE_IMAGE_ROOT_PATH: string;
  constructor(
    private route: ActivatedRoute,private http: HttpClient, private router: Router,private global: GlobalService) {
    this.route.params.subscribe( params => this.id = params.id );
   }

  ngOnInit() {
    this.PROFILE_IMAGE_ROOT_PATH  = this.global.PROFILE_IMAGE_ROOT_PATH;
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.get('/api/user/passenger/edit/'+this.id, httpOptions).subscribe(data => {
      this.result = data;
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
    });
  }

}
