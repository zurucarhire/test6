import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShopDetailModalComponent } from '../modal/shop-detail-modal/shop-detail-modal.component';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.css']
})
export class ShopDetailComponent implements OnInit {
  user: any;
  item = 8
  items = [];
  cartempty = false;
  cartcount = 0;
  totalcost = 0;
  firebasePath: string;
  constructor(private modalService: NgbModal, private router: Router,private firebaseDb: AngularFireDatabase,) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    if (this.user != null){
      this.firebasePath = 'cart/'+ this.user['user']['userID'];
      this.firebaseDb.list(this.firebasePath)
        .valueChanges().subscribe((data) => {
          if (data.length == 0){
            console.log("elem =>ww ");
              this.cartempty = true;
              this.cartcount = 0;
              return;
          }
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
    }
  }

  openModal(view, data) {
    const modalRef = this.modalService.open(view, {  size: 'lg',centered: true });
    modalRef.componentInstance.modalData = data;
    modalRef.result.then((result) => {
      if (result) {
        console.log(">>>00 " + result['procedureid']);
        console.log(">>>00gg" + result['tag']);
        //this.router.navigate["/itemdetail"];
        return
      }
    });
  }

  checkOut(){
    console.log("checkout")
    this.router.navigate(["/cart"]);
  }

  quickView(item, cost) {
    console.log(item, " = ", cost)
    this.openModal(ShopDetailModalComponent, { roleName: "dd", procedureid:"", description: "", tag: "askQuestion", item: item, cost: cost});
  }
}
