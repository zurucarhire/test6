import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { NotificationService } from '../service/notification.service';
import { Observable, of } from 'rxjs';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {

  item;
  name: string;
  cost: number;
  count = 0;
  user: any;
  firebaseCartPath: string;

  constructor(private router: Router,
    private firebaseDb: AngularFireDatabase,
    private notifyService: NotificationService,
    private api: ApiService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log("kokokokoko")
    this.route
      .params
      .subscribe(params => {
        // if (Object.keys(params).length == 0) {
        //   this.content = false;
        //   this.unavailable = "Please specify a vehicle";
        //   return;
        // }
        console.log(">>Lee ", params);
        // this.name = params['item'];
        // this.cost = params['cost']
        //this.item = params['id'];
        this.getProductById(params['id']);
      });


  }

  getProductById(id) {
    console.log(id)

    this.api.getProductById(id).subscribe(
      data => {
        console.log("getProduct ", data);
        this.item = data;

        this.user = JSON.parse(sessionStorage.getItem('user'));
        if (this.user != null) {
          this.firebaseCartPath = "cart" + "/" + this.user['user']['userID'];
          this.firebaseDb.list(this.firebaseCartPath + "/" + this.item['name'])
            .query.once('value')
            .then(data => {
              console.log(data.val())
              if (data.val() == null) {
                this.count = 0;
              } else {
                this.count = data.val().count;
              }
            }).catch(error => {
              console.log("2 => ", error);
            });
        }
      }, error => {
        console.log(error);
      });
  }

  addItem(item, cost) {
    console.log(item, "+", cost)
    if (this.user == null) {
      this.router.navigate(["/login"]);
    } else {
      if (this.count == 0) {
        this.count = this.count + 1;
        this.firebaseDb.object(this.firebaseCartPath + "/" + item).set({ item: item, cost: cost, count: this.count });
        this.notifyService.showSuccess("Added " + item + " to cart", "success");
      } else {
        this.count = this.count + 1;
        this.firebaseDb.object(this.firebaseCartPath + "/" + item).update({ count: this.count }).catch(error => this.handleError(error));
        this.notifyService.showSuccess("Added " + item + " to cart", "success");
      }
    }
  }

  minusItem(item, cost) {
    console.log(item, "-", cost)
    if (this.user == null) {
      this.router.navigate(["/login"]);
    } else {
      if (this.count == 0) {
        this.notifyService.showError("There are no items in cart", "Cart empty");
      } else {
        if (this.count == 0) {
          this.notifyService.showError("There are no items in cart", "Cart empty");
          return;
        }
        if (this.count == 1) {
          this.count = this.count - 1;
          this.firebaseDb.object(this.firebaseCartPath + "/" + item).remove().catch(error => this.handleError(error));
          this.notifyService.showSuccess("removed " + item + " from cart", "success");
          return;
        }
        this.count = this.count - 1;
        this.firebaseDb.object(this.firebaseCartPath + "/" + item).update({ count: this.count }).catch(error => this.handleError(error));
        this.notifyService.showSuccess("removed " + item + " from cart", "success");
      }
    }
  }

  checkout() {
    this.router.navigate(["/cart"])
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error("Error => ", error); // log to console instead
      return of(result as T);
    };
  }
}
