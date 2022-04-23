import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShopDetailModalComponent } from '../modal/shop-detail-modal/shop-detail-modal.component';
import { AngularFireDatabase } from '@angular/fire/database';
import { ApiService } from '../service/api.service';
import { NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.css']
})
export class ShopDetailComponent implements OnInit {
  contentBehaviorSubject = new BehaviorSubject([]);
  user: any;
  item = 8
  items = [];
  products;
  cartempty = false;
  cartcount = 0;
  totalcost = 0;
  firebasePath: string;
  productCategory: string;
  noContent = false;
  constructor(private modalService: NgbModal, private router: Router, private route: ActivatedRoute,
    private firebaseDb: AngularFireDatabase, private api: ApiService, private notifyService: NotificationService) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));

    this.route
      .params
      .subscribe(params => {
        console.log("paramz : ",params);
        if (Object.keys(params).length == 0) {
          console.log("malala");
          return;
        }
        this.contentBehaviorSubject.next([]);
        this.productCategory = params["name"];

        this.getProductsByCategory(params["name"]);
      });

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

  getProductsByCategory(name: string) {
    console.log(name)

    this.api.getProductsByCategory(name).subscribe(
      data => {
       console.log("getProductsByCategory ", data);
       this.products = data;
       this.changeContent(data);
      }, error => {
        console.log(error);
      });
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

  quickView(item) {
    console.log(item, " = ")
    this.openModal(ShopDetailModalComponent, { roleName: "dd", procedureid:"", description: "", tag: "askQuestion", item: item});
  }

  submitPrice(form: NgForm){
    this.contentBehaviorSubject.next([]);
    console.log(form.value)
    let from = form.value.from;
    let to = form.value.to;
    let product = [];
    this.products.forEach(x => {
      console.log("sle ",x)
      if (x["overallprice"] >= from && x["overallprice"] <= to){
        console.log("sle22 ",x)
        product.push(x);
      }
    });
    this.changeContent(product);
  }

  changeContent(newContent) {
    console.log("newContent-----> ", newContent);
    if (newContent.length == 0){
      this.noContent = true;
      this.notifyService.showSuccess("There are no items within your search criteria","Empty");
    } else {
      this.noContent = false;
    }
    //this.infinityLoader = false;
    this.contentBehaviorSubject.next(this.contentBehaviorSubject.getValue().concat(newContent));
  }

  handleOfferChange(offer){
    this.contentBehaviorSubject.next([]);
    let product = [];
    if (offer == 'sale'){
      this.products.forEach(x => {
        console.log("sle ",x)
        if (x["sale"] > 0){
          console.log("sle22 ",x)
          product.push(x);
        }
      });
      this.changeContent(product);
    } else if (offer == 'discount'){
      this.products.forEach(x => {
        console.log("sle ",x)
        if (x["discount"] > 0){
          console.log("sle22 ",x)
          product.push(x);
        }
      });
      this.changeContent(product);
    } else if (offer == 'all'){
      this.changeContent(this.products);
    }

  }

  handleAvailabilityChange(offer){
    this.contentBehaviorSubject.next([]);
    let product = [];
    if (offer == 'instock'){
      this.products.forEach(x => {
        console.log("sle ",x)
        if (x["count"] > 0){
          console.log("sle22 ",x)
          product.push(x);
        }
      });
      this.changeContent(product);
    } else if (offer == 'outofstock'){
      this.products.forEach(x => {
        console.log("sle ",x)
        if (x["count"] <= 0){
          console.log("sle22 ",x)
          product.push(x);
        }
      });
      this.changeContent(product);
    } else if (offer == 'all'){
      this.changeContent(this.products);
    }

  }
}
