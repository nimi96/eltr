import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.hasToken());

  constructor() { }

  private hasToken() : boolean {
		return !!localStorage.getItem('jwtToken');
  }
  
  

}
