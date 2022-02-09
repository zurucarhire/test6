import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Router } from '../../../node_modules/@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (sessionStorage.getItem('email') && sessionStorage.getItem('accesstoken')) {
      req = req.clone({
        setHeaders: {
          Authorization: "Bearer "+sessionStorage.getItem('accesstoken')
        }
      })
    }
    return next.handle(req);
  }
}