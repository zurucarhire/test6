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
  loading = false;
  emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  constructor(private router: Router, 
    private api: ApiService,
    private notifyService: NotificationService) { }

  ngOnInit(): void {
  }

  login(){
    this.router.navigate(['/login', {}]);
  }

  signup(){
    this.router.navigate(['/register', {}]);
  }

  submit(form: NgForm){
    
    const email:string = form.value.email;
    const password:string = form.value.password;
    console.log(email)
    console.log(password)

    if (email == '' || password == '') {
      this.notifyService.showError("Please enter all fields", "Validation error");
      return;
    }

    if (!this.emailRegex.test(email)) {
      this.notifyService.showError("Invalid email address", "Email Invalid");
      return;
    }

    this.loading = true;
    let user = {email: email.trim().toLowerCase(), password: password.trim()};
    sessionStorage.clear()
    this.api.authenticate(user).subscribe(
      data => {
        this.loading = false;
        console.log("data => ",data);
        sessionStorage.setItem('customer', JSON.stringify(data));
        sessionStorage.setItem("email", data['email']);
        sessionStorage.setItem("token", "Bearer " + data['token']);
        this.notifyService.showSuccess("Login Successful", "Success");
        this.router.navigate(['/home']);
      },
      error => {
        this.loading = false;
        console.log("error => ",error);
        this.notifyService.showError("Invalid Credentials", "Unable to login");
      }
    );
  }

}
