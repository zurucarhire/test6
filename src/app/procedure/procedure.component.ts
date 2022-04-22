import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/internal/Observable';
import { QuestionModalComponent } from '../modal/question-modal/question-modal.component';
import { RoleModalComponent } from '../modal/role-modal/role-modal.component';
import { Procedure } from '../model/procedure';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.css']
})
export class ProcedureComponent implements OnInit {

  user: any;
  procedures: Procedure[];

   productsObservable : Observable<any> ;

  @ViewChild("mainContent")
  private mainContentDiv!: ElementRef<HTMLElement>;

  constructor(private api: ApiService, private router: Router,
    private modalService: NgbModal,private notifyService: NotificationService) {

    }

  ngOnInit(): void {


    this.productsObservable = this.api.get_products();
    //this.observable$ = this.api.getProcedures();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
  });
    this.user = JSON.parse(sessionStorage.getItem('user'));

    //this.getProcedures();
  }

  onActivate(_event: any): void {
    // Scrolling back to the top
    // Reference: https://stackoverflow.com/questions/48048299/angular-5-scroll-to-top-on-every-route-click/48048822
    if (this.mainContentDiv) {
      (this.mainContentDiv.nativeElement as HTMLElement).scrollTop = 0;
    }
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
        }
      }
    });
  }

  getProcedures() {
    this.api.get_products().subscribe((res : any[])=>{
     // this.observable$ = res;
  });
  }
  // getProcedures() {
  //   this.api.getProcedures().subscribe(
  //     (data: Procedure[]) => {
  //       let count: number = 1;
  //       //let questionCount: number = 0;
  //       this.procedures = data;
  //       this.procedures.forEach(x => {
  //         //let questionCount[count] = x.question.length;
  //         count++;
  //         //console.log("--",questionCount)
  //       });

  //       console.log(data)
  //       console.log(data[0].question[0].dateCreated)
  //     }, error => {
  //       console.log(error);
  //     });
  // }

  findProcedureByCategory(category: string) {
    console.log(category)
    if (category == 'All'){
      this.productsObservable = this.api.get_products();
      return
    }


    this.productsObservable = this.api.get_products_by_category(category);
    // this.api.getProceduresByCategory(category).subscribe(
    //   (data: Procedure[]) => {
    //     // let count: number = 1;
    //     // this.procedures.length = 0;
    //     // this.procedures = data;

    //   }, error => {
    //     console.log(error);
    //   });
  }

  findProcedureByName(name: string) {
    console.log(name)

    this.api.getProceduresByName(name).subscribe(
      (data: Procedure[]) => {
        //this.procedures.length = 0;
        this.procedures = data;
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
    if (this.user == null){
      this.router.navigate(['/login']);
      return;
    }
    console.log(item)
    this.openModal(QuestionModalComponent, { roleName: "dd", procedureid: item['procedureID'], title: "",description: "", tag: "askQuestion", data: this.productsObservable });
  }

  moreDetail(item){
    console.log("item -> ", item);
    this.router.navigate(['/singleprocedure',item['procedureName']]);
  }

  moreDetail2(item){
    console.log("item -> ", item);
    this.router.navigate(['/singleprocedure',item]);
  }

  saveExperience(data) {
    console.log("PPP>>pppp ", data);
    console.log("PPP>>pppp238 ", this.user);
    console.log("PPP>>pppp238 ", this.user['user']['fullName']);
    this.api.saveExperience(data['procedureid'], this.user['user']['fullName'], data['description']).subscribe(
      data => {
          console.log(data);
          this.notifyService.showSuccess("Experience submitted","Success")
      },
      error => {
        console.log("error => ", error);

      }
    );
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
          this.productsObservable = this.api.get_products();
          this.notifyService.showSuccess("Question submitted","Success")
      },
      error => {
        console.log("error => ", error);

      }
    );
  }
  logOut(){
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
