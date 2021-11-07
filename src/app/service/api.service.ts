import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
const jwtHelper = new JwtHelperService();

const options = {
 
  headers: new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + sessionStorage.getItem("token"))
   // .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2VAZ21haWwuY29tIiwiT3JnVW5pdElkIjoiNWY3ZDc1ZDA2NDdjODMwYmY0ZWZiY2YwIiwiT2JqZWN0aWZ5UGF5bG9hZCI6dHJ1ZSwiUmVmZXJlbmNlSWQiOiJjODhiMjBjMC01MDQ3LTExZTYtOGMzNS04Nzg5Yjg2NWZmMTUiLCJpc3MiOiI1ZjgwMDRkNTIxMTI0NjNmNTg4MjQxMjAiLCJQYXlsb2FkIjoie1wiT3JkZXJEZXRhaWxzXCI6e1wiQ3VycmVuY3lDb2RlXCI6XCI4NDBcIixcIkFtb3VudFwiOlwiMTUwMFwiLFwiT3JkZXJOdW1iZXJcIjpcIjBlNWM1YmYyLWVhNjQtNDJlOC05ZWUxLTcxZmZmNjUyMmUxNVwifX0iLCJleHAiOjE2MDQ3Mjk5NTQsImlhdCI6MTYwNDY5Mzk1NCwianRpIjoiMTIzNDU2NyJ9.ycqaAKVcvuHpU2HWgI7yPL_HacpWbcQb6JiWzoKq2V8')
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //url = "http://localhost:8082";
  url = "http://159.223.69.40:8082";

  
  constructor(private http: HttpClient) { }

  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return !jwtHelper.isTokenExpired(token);
  }

  authenticate(user) {
    const url = this.url+"/api/public/login";
    console.log("usesr", user);
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    }
    return this.http.post(url, user, options);

    // return this.http
    //   .post<any>(url, {observe: 'response'})
    //     .subscribe(resp => {
    //       console.log(resp.headers.get('X-Token'));

    //return this.http.post<any>(url, user, {observe: 'response'});
  }

  loadDashboard() {
    const url = this.url+"/api/customer/test";
    return this.http.post(url,{email: "joe"});
  }

  registerCustomer(customer) {
    const url = this.url+"/api/customer/register";
    return this.http.post(url,customer);
  }

  updateCustomer(customer) {
    console.log("cust =>> ",customer);
    const url = this.url+"/api/customer/update";
    return this.http.put(url,customer);
  }
//   getImage(imageUrl: string) {
//     return this.http
//                .get(imageUrl, {responseType: ResponseContentType.Blob})
//                .map((res) => {
//                    return new Blob([res.blob()], {type: res.headers.get('Content-Type')});
//                });
// }
}