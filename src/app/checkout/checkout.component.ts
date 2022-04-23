import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  @ViewChild("paymentModal") paymentModal: TemplateRef<any>;
  name: string;
  total = 0;
  count: number;
  user: any;
  firebaseCartPath: string;
  closeResult: string;

  constructor(private firebaseDb: AngularFireDatabase,
    private notifyService: NotificationService,
    private router: Router, private api: ApiService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    console.log("----> ",this.user)
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

  openModal(content, size) {
    this.modalService.open(content, { size: size, ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-holder', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;


    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  cart(){
    this.router.navigate(["/cart"]);
  }

  payment(){
    this.openModal(this.paymentModal, 'sm');
    this.api.mpesaExpress(2, 1, "+254717729123",20).subscribe(data => {
      console.log(data)
    });
  }

  public getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  closeModal(){
    this.modalService.dismissAll();
  }
}
