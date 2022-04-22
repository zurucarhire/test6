import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-shop-navbar',
  templateUrl: './shop-navbar.component.html',
  styleUrls: ['./shop-navbar.component.css']
})
export class ShopNavbarComponent implements OnInit {

  user: any;
  items = [];
  cartempty = true;
  cartcount = 0;
  totalcost = 0;
  loggedin = false;
  firebasePath: string;
  name: string;
  constructor(private modalService: NgbModal, private router: Router,private firebaseDb: AngularFireDatabase) { }

  isCollapsed : boolean = false;
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    if (this.user != null){
      this.name = this.user['user']['userName'];
      this.loggedin = true;
      this.firebasePath = 'cart/'+ this.user['user']['userID'];
      this.firebaseDb.list(this.firebasePath)
        .valueChanges().subscribe((data) => {
          if (data.length == 0){
            console.log("elem =>ww ");
              this.cartempty = true;
              this.cartcount = 0;
              return;
          }
          this.cartempty = false;
          this.items.length = 0;
          this.cartcount = 0;
          data.forEach(elem => {
              console.log("elem => ",elem);
               this.cartcount = this.cartcount + 1;
              // elem['total'] = elem['cost'] * elem['counter'];
              // console.log("elem -- ", elem);
               this.items.push(elem);
          });
      });
    } else {
      this.loggedin = false;
    }
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
