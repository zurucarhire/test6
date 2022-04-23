import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/service/notification.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-shop-detail-modal',
  templateUrl: './shop-detail-modal.component.html',
  styleUrls: ['./shop-detail-modal.component.css']
})
export class ShopDetailModalComponent implements OnInit {
    @Input() public modalData;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();

    item: string;
    cost: number;
    user: any;
    firebaseCartPath: string;
    emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    constructor(
      private firebaseDb: AngularFireDatabase,
      public activeModal: NgbActiveModal,
      private notifyService: NotificationService,
      private router: Router,

    ) { }

    ngOnInit() {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      if (this.user != null){
        this.firebaseCartPath = "cart"+ "/" + this.user['user']['userID'];
      }
      console.log(">>XX",this.modalData);


    }

    passBack() {

      this.passEntry.emit(this.modalData);
      this.activeModal.close(this.modalData);
    }

    checkOut(){
      if (this.user == null){
        this.activeModal.close(this.modalData);
        this.router.navigate(['/login']);
        return;
      }
      this.activeModal.close(this.modalData);
      this.router.navigate(["/cart"]);
    }
    addToCart(item, cost){
      console.log(item, cost);
      if (this.user == null){
        this.activeModal.close(this.modalData);
        this.router.navigate(['/login']);
        return;
      }
      console.log(this.user);
      this.firebaseDb.list(this.firebaseCartPath+"/"+item)
      .query.once('value')
      .then(data => {
        console.log(data.val())
        if (data.val() == null){
          this.firebaseDb.object(this.firebaseCartPath + "/"+item).set({item: item, cost: cost, count: 1});
          this.notifyService.showSuccess("Added "+item+" to cart","success");
        } else {
          let count = data.val().count + 1;
          this.firebaseDb.object(this.firebaseCartPath + "/" + item).update({ count: count }).catch(error => this.handleError(error));
          this.notifyService.showSuccess("Added "+item+" to cart","success");
        }
      //
      }).catch(error => {
        console.log("2 => ", error);
      });
    }

    fullDescription(id){
      console.log(id);
      // if (this.user == null){
      //   this.activeModal.close(this.modalData);
      //   this.router.navigate(['/login']);
      //   return;
      // }
      //this.modalData["desc"] = "yes"
      //this.passEntry.emit(this.modalData);
      this.activeModal.close(this.modalData);
      this.router.navigate(['/itemdetail', id]);

    }

    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        console.error("Error => ", error); // log to console instead
        return of(result as T);
      };
    }

  }
