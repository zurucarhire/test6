import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {
  @Input() public modalData;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  constructor(
    public activeModal: NgbActiveModal,
    private notifyService: NotificationService,
  ) { }

  ngOnInit() {
    console.log(">>XX",this.modalData);
  }

  passBack() {
    console.log("wree", this.modalData)
    let clientName = this.modalData['clientName'];
    let userName = this.modalData['userName'];
    let fullName = this.modalData['fullName'];
    let email = this.modalData['emailAddress'];
    let idNumber = this.modalData['idNumber'];
    let phone = this.modalData['msisdn'];

    if (clientName == '' || userName == "" || fullName == "" ||
      email == "" || idNumber == "" || phone == ""){
        console.log("hello world");
        this.notifyService.showError("Please enter all fields", "Warning");
        return;
    }

    if (!this.emailRegex.test(email)) {
      this.notifyService.showError("Please enter a valid email address", "Invalid Email Address");
      return;
    }

    if (idNumber.toString().length < 4 ){
      this.notifyService.showError("Please enter a valid ID number", "Invalid ID Number");
      return;
    }

    if (phone.toString().length < 4 ){
      this.notifyService.showError("Please enter a valid mobile number", "Invalid mobile number");
      return;
    }

    this.passEntry.emit(this.modalData);
    this.activeModal.close(this.modalData);
  }
}
