import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  name: string;
  total = 0;
  count: number;
  user: any;
  firebaseCartPath: string;

  constructor(private firebaseDb: AngularFireDatabase,
    private notifyService: NotificationService,
    private router: Router,) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));

    this.firebaseCartPath = "cart"+ "/" + this.user['user']['userID'];
    this.firebaseDb.list(this.firebaseCartPath)
      .query.once('value')
      .then(data => {
        console.log(data.val())
        if (data.val() == null){
          this.total = 0;
        } else {
          data.forEach(elem => {
            console.log("elemrr => ",elem.val());
            let cost = elem.val().cost;
            let count = elem.val().count;
            this.total = this.total + (cost * count);
        });

        }
      //
      }).catch(error => {
        console.log("2 => ", error);
      });
  }

  cart(){
    this.router.navigate(["/cart"]);
  }
}
