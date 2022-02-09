import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../model/user';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  @ViewChild("editAccountModal") editAccountModal: TemplateRef<any>;
  loading = false;
  user: any;
  userId: number;
  closeResult: string;

  emailaddressvalue;
  idnumbervalue;
  msisdnvalue;

  emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  constructor(private api: ApiService, private notifyService: NotificationService,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.userId= this.user['user']['userID'];
    this.emailaddressvalue = this.user['user']['emailAddress'];
    this.idnumbervalue = this.user['user']['idNumber'];
    this.msisdnvalue = this.user['user']['msisdn'];
    console.log("AC",this.user);
  }

  openModal(content, size) {
    this.modalService.open(content, { size: size, ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-holder', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  changePasswordSubmit(form: NgForm) {
    console.log(form.value);
    let oldPassword = form.value.oldpassword;
    let newPassword = form.value.newpassword;
    let confirmPassword = form.value.repeatpassword;

    this.api.changePassword(this.userId, oldPassword, newPassword, confirmPassword).subscribe(
      data => {
        this.notifyService.showSuccess("Update successful", "Success");
    }, error => {
      console.log(error);
      this.notifyService.showError("Something went wrong, please try again", "Oops");
    });
  }

  editAccount(){
    console.log(44);
    this.openModal(this.editAccountModal,'sm');
  }
  submitEditAccount(form: NgForm) {
    console.log(form.value);

    let email = form.value.editemailaddress;
    let idNumber = form.value.editidnumber;
    let phone = form.value.editmsisdn;
    if (!this.emailRegex.test(email)) {
      this.notifyService.showError("Please enter a valid email address", "Invalid Email Address");
      return;
    }

    if (idNumber.toString().length < 8 ){
      this.notifyService.showError("Please enter a valid ID number", "Invalid ID Number");
      return;
    }

    if (phone.toString().length < 10 ){
      this.notifyService.showError("Please enter a valid mobile number", "Invalid mobile number");
      return;
    }

    this.api.editAccount(this.userId, email, idNumber, phone).subscribe(
      data => {
        this.loading = false;
        console.log("data 101 => ",data['emailAddress']);
        this.emailaddressvalue = data['emailAddress'];
        this.idnumbervalue = data['idNumber'];
        this.msisdnvalue = data['msisdn'];
        console.log("yy,",this.user);
        this.user['user']['emailAddress'] = data['emailAddress'];
        this.user['user']['idNumber'] = data['idNumber'];
        this.user['user']['msisdn'] = data['msisdn'];
        console.log("yy,",this.user);
        sessionStorage.setItem('user', JSON.stringify(this.user));
        this.modalService.dismissAll();
        this.notifyService.showSuccess("Account edited successfully", "Success");
      },
      error => {
        this.loading = false;
        console.log("error => ",error);
        this.modalService.dismissAll();
        this.notifyService.showError("Something went wrong, please try again", "Something went wrong");
      }
    );
  }
}
