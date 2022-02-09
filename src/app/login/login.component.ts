import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginattempts: number = 1;
  loading: boolean = false;
  constructor(private router: Router,private api: ApiService, private notifyService: NotificationService) { }

  ngOnInit(): void {
  }

  login(form: NgForm){
    let username = form.value.username;
    let password = form.value.password;
    console.log(username)
    console.log(password)

    if (username == "" || password == ""){
      this.notifyService.showError("Something went wrong, please try again", "Something went wrong");
     return 
    }

    let user = {email: username, password: password.trim(), loginAttempt: this.loginattempts};
    sessionStorage.clear()
    this.api.authenticate(user).subscribe(
      data => {
        this.loading = false;
        console.log("data => ",data);
        if (data["active"] == 0){
          this.notifyService.showError("Please contact administrator to activate your account", "Account Inactive");
          return;
        }
        sessionStorage.setItem('user', JSON.stringify(data));
        let u = JSON.parse(sessionStorage.getItem('user'));
        sessionStorage.setItem("email", data['user']['emailAddress']);
        sessionStorage.setItem("accesstoken", data['accessToken']);
        sessionStorage.setItem("refreshtoken", data['refreshToken']);
        this.notifyService.showSuccess("Login Successful", "Success");
        this.router.navigate(['/home']);
      },
      error => {
        this.loginattempts = this.loginattempts + 1;
        this.loading = false;
        console.log("error => ",error);
        this.notifyService.showError("Invalid Credentials", "Unable to login");
      }
    );
   // this.router.navigate(['/home', {}]);
  }

}
