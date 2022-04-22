import { Component, NgZone,OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Isotope } from '../../assets/js/isotope.pkgd.min.js';
import AOS from '../../assets/js/aos.js';
import Swiper, {SwiperOptions} from '../../assets/js/swiper-bundle.min.js';
import { ApiService } from '../service/api.service.js';
import { NotificationService } from '../service/notification.service.js';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  loginattempts: number = 1;
  loading: boolean = false;
  constructor(private router: Router, private api: ApiService,
    private notifyService: NotificationService) { }

  ngOnInit(): void {

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
        sessionStorage.setItem('user', JSON.stringify(data));
        sessionStorage.setItem("userID", data['user']['userID']);
        sessionStorage.setItem("email", data['user']['emailAddress']);
        sessionStorage.setItem("roles", data['user']['roles']);
        console.log("access_token ", data['accessToken'])
        console.log("userID ", data['user']['userID'])
        console.log("emailfk ", data['user']['emailAddress'])
        console.log("roles ", data['user']['roles'])
        sessionStorage.setItem("token", "Bearer " + data['accessToken']);
        this.notifyService.showSuccess("Login Successful", "Success");
        this.router.navigate(['/procedure']);
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

  logOut(){}
}
