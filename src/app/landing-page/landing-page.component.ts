import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Procedure } from '../model/procedure';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  data;
  nonInvasive = [];
  u: any = {};
  user: any;
  constructor(private router: Router, private api: ApiService, private notifyService: NotificationService) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    console.log("user => ", this.user);

    this.getProcedures();
  }

  getProcedures() {
    console.log()
    this.api.getProcedures().subscribe(
      (data: Procedure[]) => {
       console.log("getProcedures ", data);
        this.data = data;



        data.forEach(x => {

          if (x.category == "Non Invasive"){
            this.nonInvasive.push(x);
          }
          let city = x.city;
         // console.log("x -> ", city)
          var myObject = JSON.parse(city);
         // console.log("xxxx -> ", myObject);
          myObject.forEach(x => {
            console.log("pp -> ", x)
            if (x in this.u){
              let s = this.u[x];
              console.log("pps -> ", s)
              this.u[x] = s + 1;
            } else {

              this.u[x] = 1;
              console.log("ppsgg -> ", this.u[x])
            }
          });
          console.log("ppsggii -> ", this.u)
        })

      }, error => {
        console.log(error);
      });


  }

  popular(data){
    console.log(data)
    this.router.navigate(['/procedure',data]);
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
