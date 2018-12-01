import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  authData:string;
  adminName:string;
  constructor(private global: GlobalService) {}

  ngOnInit() { 
    this.authData = localStorage.getItem('authData');  
    this.adminName = this.global.adminName;
  }

}
