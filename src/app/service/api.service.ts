import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Procedure } from '../model/procedure';
import { Question } from '../model/question';
import { Experience } from '../model/experience';
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

  url = "http://52.91.60.228:8090";
  //url = "http://localhost:8090";


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

  getProducts() {
    const url = this.url+"/api/psm/merchant/findall";
    return this.http.get(url);
  }

  getProductCategories() {
    const url = this.url+"/api/psm/misc/findallproductcategory";
    return this.http.get(url);
  }

  getProcedures() {
    const url = this.url+"/api/psm/procedure/findall";
    return this.http.get(url);
  }

  get_products(){
    const url = this.url+"/api/psm/procedure/findall";
    return this.http.get<Procedure[]>(url)
    .pipe(map((results) => results));
}

get_products_by_category(category){
  const url = this.url+"/api/psm/procedure/findbycategory/"+category;
  return this.http.get<Procedure[]>(url)
  .pipe(map((results) => results));
}

get_experiences(){
  const url = this.url+"/api/psm/experience/findall";
  return this.http.get<Experience[]>(url)
  .pipe(map((results) => results));
}

  getProceduresByCategory(category: string) {
    const url = this.url+"/api/psm/procedure/findbycategory/"+category;
    return this.http.get(url);
  }

  getProceduresByName(name: string) {
    const url = this.url+"/api/psm/procedure/findbyname/"+name;
    return this.http.get(url);
  }

  getProductById(id) {
    const url = this.url+"/api/psm/merchant/findbyproductid/"+id;
    return this.http.get(url);
  }

  getProductsByCategory(name: string) {
    const url = this.url+"/api/psm/merchant/findallbycategory/"+name;
    return this.http.get(url);
  }

  findProductByUserID(id: number){
    const url = this.url+"/api/psm/merchant/findbyuserid?userID="+id;
    return this.http.get(url, options);
  }

  deleteProduct(id) {
    const url = this.url+"/api/psm/merchant/deleteproduct/"+id
    return this.http.delete(url,{});
  }

  registerCustomer(customer) {
    const url = this.url+"/api/psm/user/create";
    return this.http.post(url,customer);
  }

  mpesaExpress(userId, productId, msisdn, amount) {
    const url = this.url+"/api/psm/mpesa/express?userId="+userId+"&productId="+productId+"&msisdn="+msisdn+"&amount="+amount;
    return this.http.post(url,{});
  }

  saveNewsletter(email) {
    const url = this.url+"/api/psm/newsletter/create?email="+email;
    return this.http.post(url,{});
  }

  saveExperience(procedureId, name, description) {
    console.log("kk ",description)
    const url = this.url+"/api/psm/experience/create/"+procedureId+"/"+name+"/"+description;
    return this.http.post(url,{});
  }

  saveQuestion(procedureId, name,title, description) {
    const url = this.url+"/api/psm/question/create/"+procedureId+"/"+name+"/"+title+"/"+description;
    console.log(url)
    return this.http.post(url,{});
  }

  saveComment(experienceId, name, description) {
    const url = this.url+"/api/psm/experience/createcomment/"+experienceId+"/"+name+"/"+description;
    console.log(url)
    return this.http.post(url,{});
  }

  get_questions(){
    const url = this.url+"/api/psm/question/findall";
    return this.http.get<Question[]>(url)
    .pipe(map((results) => results));
}

updateProduct(productId, price, count, discount, sale, description) {
  console.log("updateProduct =>> ",productId, price, count, discount, sale, description);
  const url = this.url+"/api/psm/merchant/updateproduct?productID="+productId+"&price="+price+"&count="+count+"&discount="+discount+"&sale="+sale+"&description="+description;
  return this.http.put(url,{});
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
