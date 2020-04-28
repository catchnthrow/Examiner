// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor
// } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//   constructor() {}
//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
//     return next.handle(request).subscribe((event: HttpEvent<any>) => {
//       if (event instanceof HttpResponse) {
//         // do stuff with response if you want
//       }
//     }, (err: any) => {
//       if (err instanceof HttpErrorResponse) {
//         if (err.status === 401) {
//           // redirect to the login route
//           // or show a modal
//         }
//       }
//     });
//   }
// }