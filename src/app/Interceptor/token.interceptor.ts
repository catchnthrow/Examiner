import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//import { UserDataService } from '../services/user-data.service';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpEventType
} from '@angular/common/http';

import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router : Router) {
      console.log("TokenInterceptor constructor");
  }

intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    //--------------------------------DO NOT DELETE--------------------------------
    //This may be used in future.
    // console.log("TokenInterceptor intercept called");
    // const item = localStorage.getItem('jwt');
    // const token = item != null && item.length > 0 ? `JWT ` + item : '';
    
    // if(token != '') {
    //     console.log('Adding Auth JWT token');
    //     request = request.clone({
    //         setHeaders: {
    //           Authorization: token
    //         }
    //     });
    // } 
    
    return next.handle(request).do((event: HttpEvent<any>) => {
        if(event instanceof HttpResponse) {
            //console.log("event :", event);
            // this.saveToLocalStorage(event);
        }
    }, (err : any) => {
         if (err instanceof HttpErrorResponse) {
            //console.log("err : ", err);
            if (err.status === 401 || err.status === 403) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                this.router.navigate(['login']);
            }
        }
    });
  }
}

