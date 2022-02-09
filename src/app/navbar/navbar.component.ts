import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  account = 'Administrator';
  constructor(private router: Router) { }

  roleId: number;
  ngOnInit(): void {
    let user = JSON.parse(sessionStorage.getItem('user'));
    this.roleId = user["user"]["roleID"];
    console.log("the role ", this.roleId);
  }

  signOut(){
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

}
