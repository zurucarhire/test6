import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @ViewChild("contactModal") contactModal: TemplateRef<any>;
  closeResult: string;

  emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  constructor(private api: ApiService,  private modalService: NgbModal,
    private notifyService: NotificationService) { }

  ngOnInit(): void {
  }

  openModal(content, size) {
    this.modalService.open(content, { size: size, ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-holder', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  contact(){
    this.openModal(this.contactModal, 'lg');
  }
  submitContact(form: NgForm) {
    console.log(form.value)
    let email = form.value.email;
    let phone = form.value.phone;
    let description = form.value.description;

    if (!this.emailRegex.test(email)) {
      this.notifyService.showError("Please enter a valid email address", "Email Invalid");
      return;
    }

    if (phone.length < 12) {
      this.notifyService.showError("Please enter a valid phone number (254*********)", "Phone number Invalid");
      return;
    }

    if (description == '') {
      this.notifyService.showError("Please enter your query", "Enter query");
      return;
    }

    this.notifyService.showSuccess("Your query has been received, we will get back to you shortly","Success")
  }

  submitNewsletter(form: NgForm) {
    console.log(form.value);
    let email = form.value.email;
    if (!this.emailRegex.test(email)) {
      this.notifyService.showError("Please enter a valid email address", "Email Invalid");
      return;
    }

    this.api.saveNewsletter(email).subscribe(
      data => {
          console.log(data);
          form.resetForm();
          this.notifyService.showSuccess("You will receive regular newsletters","Success")
      },
      error => {
        console.log("error => ", error.status);
        if (error.status == 409){
          this.notifyService.showSuccess("You are already subscribed for our newsletter", "Already subscribed");
        } else {
          this.notifyService.showError("Something went wrong, please try again", "Oops");
        }

      }
    );
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

}
