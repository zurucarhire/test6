import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartempty = false;
  user: any;
  firebaseCartPath: string;
  items = [];
  total = 0;
  constructor(private firebaseDb: AngularFireDatabase,
    private notifyService: NotificationService,
    private router: Router,) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));

    this.refresh();
    // this.firebaseCartPath = "cart"+ "/" + this.user['user']['userID'];

    // this.firebaseDb.list(this.firebaseCartPath)
    //     .valueChanges().subscribe((data) => {
    //       this.items.length = 0;
    //       this.total = 0;
    //       if (data.length == 0){
    //         this.cartempty = true;
    //            return;
    //       }
    //       this.cartempty = false;
    //       data.forEach(elem => {
    //         console.log("elemrr => ",elem);
    //         this.total = this.total + elem['cost'] * elem['count'];
    //           this.items.push(elem);
    //     });
    //   });

  }

  refresh() {
    this.items.length = 0;
    this.total = 0;
    this.items.length = 0;
    let cart: [] = JSON.parse(localStorage.getItem('pmscart'));
    console.log("ggg", cart.length == 0)

    if (cart == null) {
      console.log("ggg1", cart.length == 0)
      this.cartempty = true;
      return;
    }

    if (cart.length == 0) {
      console.log("ggg2", cart.length == 0)
      this.cartempty = true;
      return;
    }

    this.cartempty = false;
    cart.forEach(x => {
      this.total = this.total + x['cost'] * x['count'];
      this.items.push(x);
    });
  }

  addItem(item, cost, count) {
    let cart = JSON.parse(localStorage.getItem('pmscart'));
    console.log(item, "+", cost)
    cart.forEach(x => {
      console.log(x)
      if (item == x["item"]) {
        console.log("yessss")
        x['count'] = x['count'] + 1;
        //break;
      }
    });
    localStorage.setItem("pmscart", JSON.stringify(cart));
    this.refresh();
    //this.firebaseDb.object(this.firebaseCartPath + "/" + item).update({ count: count + 1 }).catch(error => this.handleError(error));
    this.notifyService.showSuccess("Added " + item + " to cart", "success");
  }

  minusItem(item, cost, count) {
    let cart = JSON.parse(localStorage.getItem('pmscart'));
    console.log(item, "-", cost)
    if (count == 1) {
      let num = 0;
      for (let i = 0; i < cart.length; i++) {
        if (item == cart[i]["item"]) {
          console.log("yessss22 ", cart[i]["item"])
          console.log("yessss22ff ", i)
          num = i;
        }
      }
      cart.splice(num, 1);
      localStorage.setItem("pmscart", JSON.stringify(cart));
      this.refresh()
      //this.firebaseDb.object(this.firebaseCartPath + "/" + item).remove().catch(error => this.handleError(error));
      this.notifyService.showSuccess("removed " + item + " from cart", "success");
    } else {
      cart.forEach(x => {
        console.log(x)
        if (item == x["item"]) {
          console.log("yessss")
          x['count'] = x['count'] - 1;
          //break;
        }
      });
      localStorage.setItem("pmscart", JSON.stringify(cart));
      this.refresh()
      //this.firebaseDb.object(this.firebaseCartPath + "/" + item).update({ count: count - 1 }).catch(error => this.handleError(error));
      this.notifyService.showSuccess("removed " + item + " from cart", "success");
    }
  }

  checkOut() {
    if (this.cartempty) {
      this.notifyService.showError("No items in cart", "Cart Empty");
      return;
    }
    this.router.navigate(["/checkout"]);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error("Error => ", error); // log to console instead
      return of(result as T);
    };
  }
}
