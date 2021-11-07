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
  loading = false;
  emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  constructor(private router: Router, private notifyService: NotificationService, private api: ApiService) { }

  ngOnInit(): void {
  }

  submit(form: NgForm){
    
    const username:string = form.value.username;
    const email:string = form.value.email;
    const msisdn:string = form.value.msisdn;
    const password:string = form.value.password;
    const cpassword:string = form.value.cpassword;
    console.log(msisdn)
    console.log(msisdn.toString().length)

    if (username == '' || email == '' || msisdn == '' || password == '' || cpassword == '') {
      this.notifyService.showError("Please enter all fields", "Validation error");
      return;
    }

    if (!this.emailRegex.test(email)) {
      this.notifyService.showError("Invalid email address", "Email Invalid");
      return;
    }

    if (msisdn.toString().length != 9) {
      this.notifyService.showError("Please enter a valid phone number", "Invalid Phone");
      return;
    }

    if (password != cpassword) {
      this.notifyService.showError("Passwords do not match", "Invalid Passwords");
      return;
    }

    this.loading = true;
    let customer = {username: username.trim().toLowerCase(),email: email.trim().toLowerCase(), 
      msisdn: "254"+msisdn.toString().trim(), password: password.trim(), confirmpassword: cpassword.trim(), roles: "ROLE_USER",
      bankstatementsannualreturns: "nil", idpassport: "nil",memorandumarticlesofassociation: "nil",
      kracertificate: "nil", registrationcertificate: "nil", businesslicense: "nil", boardresolution: "nil",
    };
    this.api.registerCustomer(customer).subscribe(
      data => {
        this.loading = false;
        console.log("data => ",data);
        this.notifyService.showSuccess("You have registered successfully", "Login to continue");
        this.router.navigate(['/login']);
      },
      error => {
        this.loading = false;
        console.log("error => ",error);
        this.notifyService.showError("The email or phone already exists", "Something went wrong");
      }
    );
  }
}
