import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  constructor(private api: ApiService, private notifyService: NotificationService) { }

  ngOnInit(): void {
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

}
