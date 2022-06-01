import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  loading: false;
  constructor(private router: Router, private api: ApiService,
    private notifyService: NotificationService) { }

  ngOnInit(): void {
  }

  submitCustomer(form: NgForm){
    console.log(form.value)
    let email = form.value.email;
    let name = form.value.name;
    let password = form.value.password;
    let cpassword = form.value.cpassword;

    if (!this.emailRegex.test(email)) {
      this.notifyService.showError("Please enter a valid email address", "Email Invalid");
      return;
    }

    if (name.length < 4) {
      this.notifyService.showError("Please enter a valid full name", "Full name Invalid");
      return;
    }

    if (password.length < 4) {
      this.notifyService.showError("Password should be more than 4 characters", "Invalid password");
      return;
    }

    if (password != cpassword) {
      this.notifyService.showError("Passwords do not match", "Password mismatch");
      return;
    }

    let user = {roleID: 1, fullName: name, emailAddress: email.trim().toLowerCase(), password: password.trim(),
      cpassword: cpassword.trim(), businessName: "nil", shopLocation: "nil", phone: "nil", profileImage: "nil",
      category: "customer", status: 1};
    this.api.registerCustomer(user).subscribe(
      data => {
        this.loading = false;
        console.log("data => ",data);
        this.notifyService.showSuccess("Registration Successful, please sign in to continue", "Success");
        this.router.navigate(['/login']);
      },
      error => {
        this.loading = false;
        console.log("error => ",error);
        this.notifyService.showError("Invalid Credentials", "Unable to login");
      }
    );
  }

  submitMerchant(form: NgForm){
    console.log(form.value)
    let email = form.value.merchantemail;
    let businessname = form.value.businessname;
    let shoplocation = form.value.shoplocation;
    let phone = form.value.phone;

    console.log("op",form.value)
    if (!this.emailRegex.test(email)) {
      this.notifyService.showError("Please enter a valid email address", "Email Invalid");
      return;
    }

    if (businessname.length < 4) {
      this.notifyService.showError("Please enter a valid business name", "Business name Invalid");
      return;
    }

    if (shoplocation.length < 3) {
      this.notifyService.showError("Please enter a valid shop location", "Invalid shop location");
      return;
    }

    if (phone.length != 12) {
      this.notifyService.showError("Please enter a valid phone (254*********)", "Invalid phone");
      return;
    }

    let user = {roleID: 2, fullName: businessname, emailAddress: email.trim().toLowerCase(), password: "nil",
      cpassword: "nil", businessName: businessname, shopLocation: shoplocation, phone: phone, profileImage: "nil",
      category: "merchant", status: 0};
    this.api.registerCustomer(user).subscribe(
      data => {
        this.loading = false;
        console.log("data => ",data);
        this.notifyService.showSuccess("Thank you for contacting us, our agent will get back to you within 24 hours", "Success");
        this.router.navigate(['/']);
      },
      error => {
        this.loading = false;
        console.log("error => ",error);
        this.notifyService.showError("Invalid Credentials", "Unable to login");
      }
    );
  }

}
