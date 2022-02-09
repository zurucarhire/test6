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

  url = "http://localhost:8090";
  //url = "http://197.248.60.196:8082";


  constructor(private http: HttpClient) { }

  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return !jwtHelper.isTokenExpired(token);
  }

  authenticate(user) {
    const url = this.url+"/api/login";
    console.log("usesr", user);
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    }
    return this.http.post(url, user, options);
  }

  loadDashboard() {
    const url = this.url+"/api/customer/test";
    return this.http.post(url,{email: "joe"});
  }

  findAllUsers() {
    const url = this.url+"/api/iprs/user/findall";
    return this.http.get(url);
  }

  findAllUserRoles() {
    const url = this.url+"/api/iprs/user/findalluserroles";
    return this.http.get(url);
  }

  findExpiry() {
    const url = this.url+"/api/iprs/expiry/findall";
    return this.http.get(url);
  }


  findAllSearch() {
    const url = this.url+"/api/iprs/customer/findall";
    return this.http.get(url);
  }

  findAllSearch2(name) {
    const url = this.url+"/api/iprs/customer/findall2/"+name;
    return this.http.get(url);
  }

  findAllRoles() {
    const url = this.url+"/api/iprs/role/findall";
    return this.http.get(url);
  }

  updateUser(id, updatedBy, user) {
    const url = this.url+"/api/iprs/user/update/"+id+"/"+updatedBy;
    return this.http.put(url,user);
  }

  changePassword(id, oldPassword, newPassword, confirmPassword) {
    const url = this.url+"/api/iprs/user/changepassword?userId="+id+"&oldPassword="+oldPassword+"&newPassword="+newPassword+"&confirmPassword="+confirmPassword;
    return this.http.put(url,{});
  }

  updateRole(id, description) {
    const url = this.url+"/api/iprs/role/update/"+id+"/"+description
    return this.http.put(url,{});
  }

  updateExpiryPeriod(id, period) {
    const url = this.url+"/api/iprs/expiry/update/"+id+"/"+period
    return this.http.put(url,{});
  }

  deleteUser(id, updatedBy) {
    const url = this.url+"/api/iprs/user/delete/"+id+"/"+updatedBy
    return this.http.delete(url,{});
  }

  deleteExpiryPeriod(id) {
    const url = this.url+"/api/iprs/expiry/delete/"+id
    return this.http.delete(url,{});
  }


  deleteRole(id) {
    const url = this.url+"/api/iprs/role/delete/"+id
    return this.http.delete(url,{});
  }

  saveUser(insertedby, user) {
    const url = this.url+"/api/iprs/user/create/"+insertedby;
    return this.http.post(url,user);
  }

  editAccount(id, email, idNumber, msisdn) {
    const url = this.url+"/api/iprs/user/editaccount?userId="+id+"&email="+email+"&idNumber="+idNumber+"&msisdn="+msisdn;
    return this.http.put(url,{});
  }

  saveRole(role) {
    console.log(role)
    const url = this.url+"/api/iprs/role/create";
    return this.http.post(url,role);
  }

  editUserRole(userId, roleId) {
    const url = this.url+"/api/iprs/user/edituserrole/"+userId+"/"+roleId
    return this.http.put(url,{});
  }

  deleteUserRole(userId) {
    const url = this.url+"/api/iprs/user/deleteuserrole/"+userId
    return this.http.delete(url,{});
  }

  findAllClients() {
    const url = this.url+"/api/iprs/client/findall";
    return this.http.get(url);
  }

  findAllRequestTypes() {
    const url = this.url+"/api/iprs/requesttype/findall";
    return this.http.get(url);
  }
}
