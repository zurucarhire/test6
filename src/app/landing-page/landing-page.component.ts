import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  user: any;
  constructor(private router: Router, private api: ApiService, private notifyService: NotificationService) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    console.log("user => ", this.user);
  }

  procedure(){
    this.router.navigate(['/procedure']);
  }

  moreDetail(item){
    console.log("item -> ", item);
    this.router.navigate(['/singleprocedure',item]);
  }

  logOut(){
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  submitNewsletter(form: NgForm) {
    console.log(form.value);
    // this.api.saveNewsletter(email).subscribe(
    //   data => {
    //       console.log(data);
    //       this.notifyService.showSuccess("Experience submitted","Success")
    //   },
    //   error => {
    //     console.log("error => ", error);

    //   }
    // );
  }
}
