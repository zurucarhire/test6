import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-merchant-navbar',
  templateUrl: './merchant-navbar.component.html',
  styleUrls: ['./merchant-navbar.component.css']
})
export class MerchantNavbarComponent implements OnInit {

  constructor(private modalService: NgbModal, private router: Router,private firebaseDb: AngularFireDatabase) { }


  ngOnInit(): void {
  }

  logIn(){
    this.router.navigate(["/login"]);
  }

  logOut(){
    sessionStorage.clear();
    this.router.navigate(["/"]);
  }

  viewCart(){
    this.router.navigate(["/cart"]);
  }
}
