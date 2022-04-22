import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/internal/Observable';
import { QuestionModalComponent } from '../modal/question-modal/question-modal.component';
import { RoleModalComponent } from '../modal/role-modal/role-modal.component';
import { Procedure } from '../model/procedure';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ExperienceCommentModalComponent } from '../modal/experience-comment-modal/experience-comment-modal.component';

@Component({
  selector: 'app-single-procedure',
  templateUrl: './single-procedure.component.html',
  styleUrls: ['./single-procedure.component.css']
})
export class SingleProcedureComponent implements OnInit {
  public tabIndex = 0;
  procedure: any;
  user: any;
  procedures: Procedure[];
  procedureName: string;
  question;
  experience;
   productsObservable : Observable<any> ;

  @ViewChild("mainContent")
  private mainContentDiv!: ElementRef<HTMLElement>;

  constructor(private api: ApiService, private router: Router,private route: ActivatedRoute,
    private modalService: NgbModal,private notifyService: NotificationService) {

    }

  ngOnInit(): void {

    this.route
      .params
      .subscribe(params => {
        console.log("paramz : ",params);
        if (Object.keys(params).length == 0) {
          console.log("malala");
          return;
        }
        this.procedureName = params["name"];

        this.getProcedureByName(params["name"]);
      });
    this.productsObservable = this.api.getProceduresByName(this.procedureName);
    //this.observable$ = this.api.getProcedures();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
  });
    this.user = JSON.parse(sessionStorage.getItem('user'));
   // console.log("poo = ", this.user);
   // console.log("poo = ", this.user['user']['userName']);
    //this.getProcedures();
  }


  onActivate(_event: any): void {
    // Scrolling back to the top
    // Reference: https://stackoverflow.com/questions/48048299/angular-5-scroll-to-top-on-every-route-click/48048822
    if (this.mainContentDiv) {
      (this.mainContentDiv.nativeElement as HTMLElement).scrollTop = 0;
    }
  }

  selectedTab(e: MatTabChangeEvent) {
    console.log(e.index)
    this.findProcedureByName("Face Lift");
    console.log("101", this.question);
    console.log("102", this.experience);
  }

  openModal(view, data) {
    const modalRef = this.modalService.open(view, { centered: true });
    modalRef.componentInstance.modalData = data;
    modalRef.result.then((result) => {
      if (result) {
        console.log(">>>00 " + result['procedureid']);
        console.log(">>>00gg" + result['tag']);
        if (result['tag'] == 'shareExperience') {
          this.saveExperience(result);
        } else if (result['tag'] == 'askQuestion') {
          this.saveQuestion(result);
        } else if (result['tag'] == 'comment') {
          this.saveComment(result);
        }
      }
    });
  }

  getProcedures() {
    this.api.get_products().subscribe((res : any[])=>{
     // this.observable$ = res;
  });
  }

  findProcedureByCategory(category: string) {
    console.log(category)

    this.api.getProceduresByCategory(category).subscribe(
      (data: Procedure[]) => {
        let count: number = 1;
        this.procedures.length = 0;
        this.procedures = data;
        console.log("ewew",this.procedures)
      }, error => {
        console.log(error);
      });
  }

  findProcedureByName(name: string) {
    console.log("ppo",name)

    this.api.getProceduresByName(name).subscribe(
      (data: Procedure[]) => {
        console.log(data)
        //this.procedures.length = 0;
        this.question = data[0]['question'];
        this.experience = data[0]['experience'];
        this.procedures = data;
      }, error => {
        console.log(error);
      });
  }

  getProcedureByName(name: string) {
    console.log(name)

    this.api.getProceduresByName(name).subscribe(
      (data: Procedure[]) => {
       console.log("getProcedureName ", data);
       this.procedure = data[0];
       console.log("getProcedureName2 ", this.procedure);
      }, error => {
        console.log(error);
      });
  }

  shareExperience() {
    if (this.user == null){
      this.router.navigate(['/login']);
      return;
    }
    this.openModal(RoleModalComponent, { roleName: "dd", procedureid:"", description: "", tag: "shareExperience", data: this.productsObservable });
  }

  askQuestion(item) {
    console.log(item)
    this.openModal(QuestionModalComponent, { roleName: "dd", procedureid: item['procedureID'], title: "",description: "", tag: "askQuestion", data: this.productsObservable });
  }

  askQuestion2() {
    if (this.user == null){
      this.router.navigate(['/login']);
      return;
    }
    console.log(this.procedure)
    this.openModal(QuestionModalComponent, { roleName: "dd", procedureid: this.procedure['procedureID'], title: "",description: "", tag: "askQuestion", data: this.productsObservable });
  }

  saveExperience(data) {
    console.log("PPP>>pppp ", data);
    console.log("PPP>>pppp238 ", this.user);
    console.log("PPP>>pppp238 ", this.user['user']['fullName']);
    this.api.saveExperience(data['procedureid'], this.user['user']['fullName'], data['description']).subscribe(
      data => {
          console.log(data);
          this.productsObservable = this.api.getProceduresByName(this.procedureName);
          this.notifyService.showSuccess("Experience submitted","Success")
      },
      error => {
        console.log("error => ", error);

      }
    );
  }

  moreDetail2(item){
    console.log("item -> ", item);

    this.router.navigate(['/singleprocedure',item]);
    this.procedureName = item;
    this.productsObservable = this.api.getProceduresByName(this.procedureName);
  }

  saveQuestion(data) {
    console.log("PPP>> ", data);
    let name = "Anonymous";
    if (this.user != null){
      name = this.user['user']['fullName'];
    }
    this.api.saveQuestion(data['procedureid'], name, data['title'], data['description']).subscribe(
      data => {
          console.log(data);
          this.productsObservable = this.api.getProceduresByName(this.procedureName);
          this.notifyService.showSuccess("Question submitted","Success")
      },
      error => {
        console.log("error => ", error);

      }
    );
  }

  saveComment(data) {
    console.log("PPP>> ", data);
    let name = "Anonymous";
    if (this.user != null){
      name = this.user['user']['fullName'];
    }
    this.api.saveComment(data['experienceID'], name, data['description']).subscribe(
      data => {
          console.log(data);
          this.productsObservable = this.api.getProceduresByName(this.procedureName);
          this.notifyService.showSuccess("Question submitted","Success")
      },
      error => {
        console.log("error => ", error);

      }
    );
  }

  comment(item){
    console.log(item)
    this.openModal(ExperienceCommentModalComponent, { experienceID: item,description: "", tag: "comment", data: this.productsObservable });
  }

  back(){
    sessionStorage.clear();
    this.router.navigate(['/procedure']);
  }

  logOut(){
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
