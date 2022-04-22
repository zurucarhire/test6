import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-experience-comment-modal',
  templateUrl: './experience-comment-modal.component.html',
  styleUrls: ['./experience-comment-modal.component.css']
})
export class ExperienceCommentModalComponent implements OnInit {
  @Input() public modalData;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

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
