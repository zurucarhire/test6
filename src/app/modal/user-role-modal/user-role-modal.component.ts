import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-role-modal',
  templateUrl: './user-role-modal.component.html',
  styleUrls: ['./user-role-modal.component.css']
})
export class UserRoleModalComponent implements OnInit {

  @Input() public modalData;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    console.log(">>XX",this.modalData);
  }

  passBack() {
    this.passEntry.emit(this.modalData);
    this.activeModal.close(this.modalData);
  }
}
