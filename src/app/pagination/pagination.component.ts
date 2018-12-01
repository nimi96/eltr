import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input('url') url:any;
  @Input('searchFormData') searchFormData:any;
  @Input('pages') pages:number;
  @Input('currentpage') currentpage:number;
  @Output() paginateResult = new EventEmitter();
  pgaeLinkArr = [];

  httpOptions = {
    headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
  };

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() { 
    this.pagesArray(this.pages); 
  }

  pagesArray(n: number){ 
    this.pgaeLinkArr  = [];
    for (let i = 1; i <= this.pages; i++){ 
      var half_total_links:number = 3;
      var from:number  = this.currentpage - half_total_links;
      var to:number  = this.currentpage + half_total_links;
      if(this.currentpage < half_total_links){
        to  +=  half_total_links - this.currentpage;
      }
      if(this.pages-this.currentpage < half_total_links){
        from  -=  half_total_links - (this.pages-this.currentpage)-1;
      } 
      if (from < i && i < to){ 
        this.pgaeLinkArr.push({'key':i});
      }
    }   
   // return this.pgaeLinkArr;
  }

  nextPage(pageNumber){ 
    this.http.post(this.url,{'page':pageNumber},this.httpOptions).subscribe(data => {
      this.paginateResult.emit(data);
      this.pagesArray(this.pages); 
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
    });
  }

}
