import { Component, OnInit } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router"; 
import { tap, catchError, first } from 'rxjs/operators'; 
import { AuthenticationService } from '../authentication/authentication.service';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData = { username:'', password:'' };
  message = '';
  data: any; 

  constructor(private http: HttpClient, private router: Router,private authenticationService: AuthenticationService,private dataS: DataService) { }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('skin-blue'); 
    body.classList.add('login-page'); 

    this.authenticationService.logout();
  }

  login() {  
    this.authenticationService.login(this.loginData.username, this.loginData.password)
      .pipe(first())
      .subscribe(resp => {
        this.data = resp;
        localStorage.setItem('jwtToken', this.data.token);
        this.router.navigate(['dashboard']);
      }, err => {
        this.message = err.error.msg;
      });
      
  }
  
}
