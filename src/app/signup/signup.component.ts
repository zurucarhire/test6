import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  loginattempts: number = 1;
  loading: boolean = false;
  constructor(private router: Router, private api: ApiService,
    private notifyService: NotificationService) { }

  ngOnInit(): void {

  }

  submit(form: NgForm){

    const username:string = form.value.username;
    const fullname:string = form.value.fullname;
    const email:string = form.value.email;
    const password:string = form.value.password;
    const cpassword:string = form.value.cpassword;
    console.log(username)
    console.log(fullname)
    console.log(email)
    console.log(password)
    console.log(cpassword)
    if (username == '' || email == '' || password == '' || cpassword == '') {
      this.notifyService.showError("Please enter all fields", "Validation error");
      return;
    }

    if (!this.emailRegex.test(email)) {
      this.notifyService.showError("Invalid email address", "Email Invalid");
      return;
    }

    if (password != cpassword){
      this.notifyService.showError("Your passwords do not match", "Password Mismatch");
      return;
    }

    this.loading = true;
    let user = {roleID: 1, userName: username.trim(), fullName: fullname, emailAddress: email.trim().toLowerCase(), password: password.trim(), cpassword: cpassword.trim()};
    sessionStorage.clear()
    this.api.registerCustomer(user).subscribe(
      data => {
        this.loading = false;
        console.log("data => ",data);
        // sessionStorage.setItem('customer', JSON.stringify(data));
        // sessionStorage.setItem("email", data['email']);
        // sessionStorage.setItem("roles", data['roles']);
        // console.log("access_token ", data['accesstoken'])
        // sessionStorage.setItem("token", "Bearer " + data['accesstoken']);
        this.notifyService.showSuccess("Login Successful, please sign in to continue", "Success");
        this.router.navigate(['/login']);
        // this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        // this.router.navigate(["/"]));
      },
      error => {
        this.loading = false;
        console.log("error => ",error);
        this.notifyService.showError("Invalid Credentials", "Unable to login");
      }
    );
  }

}

