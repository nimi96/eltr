import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global/global.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  adminName:string;
  constructor(private global: GlobalService) { }

  ngOnInit() {
    this.adminName = this.global.adminName;
  }

}
