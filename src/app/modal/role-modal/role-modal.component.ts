import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.css']
})
export class RoleModalComponent implements OnInit {
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
