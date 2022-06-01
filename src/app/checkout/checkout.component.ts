import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { NgForm } from '@angular/forms';
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
  emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  tst = "ppp";
  constructor(private firebaseDb: AngularFireDatabase,
    private notifyService: NotificationService,
    private router: Router, private api: ApiService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.refresh();
    // this.firebaseCartPath = "cart"+ "/" + this.user['user']['userID'];
    // this.firebaseDb.list(this.firebaseCartPath)
    //   .query.once('value')
    //   .then(data => {
    //     console.log(data.val())
    //     if (data.val() == null){
    //       this.total = 0;
    //     } else {
    //       data.forEach(elem => {
    //         console.log("elemrr => ",elem.val());
    //         let cost = elem.val().cost;
    //         let count = elem.val().count;
    //         this.total = this.total + (cost * count);
    //     });

    //     }
    //   //
    //   }).catch(error => {
    //     console.log("2 => ", error);
    //   });
  }

  refresh() {
    this.total = 0;
    let cart: [] = JSON.parse(localStorage.getItem('pmscart'));
    console.log("ggg", cart.length == 0)

    if (cart == null) {
      console.log("ggg1", cart.length == 0)
      return;
    }

    if (cart.length == 0) {
      console.log("ggg2", cart.length == 0)
      return;
    }

    cart.forEach(x => {
      this.total = this.total + x['cost'] * x['count'];
      let cost = x['cost'];
      let count =x['count'];
      this.total = this.total + (cost * count);
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

  submit(form: NgForm){
    console.log(form.value);
    let email = form.value.email;
    let name = form.value.name;
    let address = form.value.address;
    let phone = form.value.phone;

    if (!this.emailRegex.test(email)){
      this.notifyService.showError("Please enter a valid email address","Invalid Email Address");
      return;
    }

    if (name.length < 4){
      this.notifyService.showError("Please enter a valid full name","Invalid Full Names");
      return;
    }

    if (address.length < 4){
      this.notifyService.showError("Please enter a valid delivery address","Invalid Physical Address");
      return;
    }

    if (phone.length != 12){
      this.notifyService.showError("Please enter a valid phone number (254xxxxxxxxx)","Invalid Phone");
      return;
    }

    this.openModal(this.paymentModal, 'lg');
    this.api.mpesaExpress(2, 1, "+"+phone,20).subscribe(data => {
      console.log(data)
    });
  }
}
