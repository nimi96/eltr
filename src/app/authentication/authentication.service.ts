import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../global/global.service';
import { DataService } from '../data/data.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  constructor(private http: HttpClient, private global: GlobalService,private dataS: DataService) { } 

  login(username: string, password: string) {
    return this.http.post<any>('/api/signin', { username: username, password: password })
        .pipe(map(user => {  
            // login successful if there's a jwt token in the response
            if (user && user.token) {
               // localStorage.setItem('jwtToken', JSON.stringify(user));
                localStorage.setItem('jwtToken',user.token);
                localStorage.setItem('authData',user.user);
                this.dataS.isUserLoggedIn.next(true);

                console.log(user.user);
                // store user details and jwt token in local storage to keep user logged in between page refreshes
            }

            return user;
        }));
  }
  logout() { 
    // remove user from local storage to log user out
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('authData');
      this.dataS.isUserLoggedIn.next(false);
  }
}
