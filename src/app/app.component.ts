import { Component } from '@angular/core';
import { DataService } from './data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mean-secure';
  userLogin: string;
  isUserLoggedIn:boolean;

  constructor(private dataS: DataService) { }
  
  ngOnInit() {
    this.userLogin = localStorage.getItem('jwtToken'); 
    this.dataS.isUserLoggedIn.subscribe( value => {
      this.isUserLoggedIn = value;
    }); 
  }
}
