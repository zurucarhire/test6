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

    this.firebaseCartPath = "cart"+ "/" + this.user['user']['userID'];

    this.firebaseDb.list(this.firebaseCartPath)
        .valueChanges().subscribe((data) => {
          this.items.length = 0;
          this.total = 0;
          if (data.length == 0){
            // console.log("elem =>ww ");
            this.cartempty = true;
            //   this.cartcount = 0;
               return;
          }
          this.cartempty = false;
          data.forEach(elem => {
            console.log("elemrr => ",elem);
            this.total = this.total + elem['cost'] * elem['count'];
            // this.total = this.total + elem.cost;
            // // this.cartcount = this.cartcount + 1;
            // // elem['total'] = elem['cost'] * elem['counter'];
            // // console.log("elem -- ", elem);
              this.items.push(elem);
        });
      });

    // this.firebaseDb.list(this.firebaseCartPath)
    //   .query.once('value')
    //   .then(data => {
    //     console.log("-> ",data.val())
    //     if (data.val() == null){
    //     } else {
    //       data.forEach(elem => {
    //         console.log("elemrr => ",elem.val());
    //         this.total = this.total + elem.val().cost;
    //         // this.cartcount = this.cartcount + 1;
    //         // elem['total'] = elem['cost'] * elem['counter'];
    //         // console.log("elem -- ", elem);
    //          this.items.push(elem.val());
    //     });
    //     }
    //   //
    //   }).catch(error => {
    //     console.log("2 => ", error);
    //   });
  }

  addItem(item, cost, count){
    console.log(item,"+", cost)
    this.firebaseDb.object(this.firebaseCartPath + "/" + item).update({ count: count+1}).catch(error => this.handleError(error));
    this.notifyService.showSuccess("Added "+item+" to cart","success");
  }

  minusItem(item, cost, count){
    console.log(item,"-", cost)
    if (count == 1){
      this.firebaseDb.object(this.firebaseCartPath + "/"+item).remove().catch(error => this.handleError(error));
      this.notifyService.showSuccess("removed "+item+" from cart","success");
    } else {
      this.firebaseDb.object(this.firebaseCartPath + "/" + item).update({ count: count-1}).catch(error => this.handleError(error));
      this.notifyService.showSuccess("removed "+item+" from cart","success");
    }
  }

  checkOut(){
    if (this.cartempty){
      this.notifyService.showError("No items in cart","Cart Empty");
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
