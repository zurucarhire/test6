import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-expiry-check-modal',
  templateUrl: './expiry-check-modal.component.html',
  styleUrls: ['./expiry-check-modal.component.css']
})
export class ExpiryCheckModalComponent implements OnInit {

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

    this.passEntry.emit(this.modalData);
    this.activeModal.close(this.modalData);
  }

}
