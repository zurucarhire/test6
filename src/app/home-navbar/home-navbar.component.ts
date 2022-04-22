import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-navbar',
  templateUrl: './home-navbar.component.html',
  styleUrls: ['./home-navbar.component.css']
})
export class HomeNavbarComponent implements OnInit {

  user: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
   this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  logOut(){
    console.log("ee")
    sessionStorage.clear();
    this.router.navigate(["/home"]);
  }

}
