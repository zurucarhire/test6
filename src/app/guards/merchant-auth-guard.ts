import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';
//import { ApiService } from '../service/api.service';

@Injectable()
export class MerchantAuthGuard implements CanActivate {


  constructor(private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (sessionStorage.getItem('token') && JSON.parse(sessionStorage.getItem('user'))['user']['category'] == 'merchant') {
        // logged in so return true
        return true;
    }

    // navigate to login page
    this._router.navigate(['/notallowed']);
    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }

}
