import { Component, OnInit } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public totalPassenger:Number;
  public totalDriver:Number;
  public totalOffer:Number;
  public totalCarmodel:Number;
  httpOptions = {
    headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
  };
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page'); 
    body.classList.add('skin-blue'); 
    this.dashboardData();
  }
 
  private dashboardData(){   
    this.http.post('/api/user/dashboard',{'page':1},this.httpOptions).subscribe(data => { 
      this.totalDriver = data[0]['totalDriver'];  
      this.totalPassenger = data[1]['totalPassenger'];  
      this.totalCarmodel = data[2]['totalCarmodel'];  
      this.totalOffer = data[3]['totalOffer'];  
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
    });
  }

}
