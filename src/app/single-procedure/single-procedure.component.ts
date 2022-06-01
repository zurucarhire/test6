import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/internal/Observable';
import { QuestionModalComponent } from '../modal/question-modal/question-modal.component';
import { RoleModalComponent } from '../modal/role-modal/role-modal.component';
import { Procedure } from '../model/procedure';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ExperienceCommentModalComponent } from '../modal/experience-comment-modal/experience-comment-modal.component';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-single-procedure',
  templateUrl: './single-procedure.component.html',
  styleUrls: ['./single-procedure.component.css']
})
export class SingleProcedureComponent implements OnInit {
  closeResult: string;
  loading = false;
  files: any;
  filesAccepted: boolean = false;

  url = "http://52.91.60.228:8090";
  //url: string = "http://localhost:8090";

  @ViewChild("experienceModal") experienceModal: TemplateRef<any>;
  @ViewChild("questionModal") questionModal: TemplateRef<any>;
  @ViewChild("loginCommentModal") loginCommentModal: TemplateRef<any>;
  @ViewChild("commentModal") commentModal: TemplateRef<any>;

  public tabIndex = 0;
  procedure: any;
  user: any;
  procedures: Procedure[];
  procedureId: number;
  question;
  experience;
  experienceID;
   productsObservable : Observable<any> ;

  @ViewChild("mainContent")
  private mainContentDiv!: ElementRef<HTMLElement>;

  constructor(private api: ApiService, private router: Router,private route: ActivatedRoute,
    private modalService: NgbModal,private notifyService: NotificationService,
    private http: HttpClient) {

    }

  ngOnInit(): void {

    this.route
      .params
      .subscribe(params => {
        console.log("paramzq : ",params);
        if (Object.keys(params).length == 0) {
          console.log("malala");
          return;
        }
        this.procedureId = params["id"];

        this.getProcedureByID(params["id"]);
      });
    this.productsObservable = this.api.getProceduresById(this.procedureId);
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

  openModal2(content, size) {
    this.modalService.open(content, { size: size, ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-holder', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  getProcedureByID(id: number) {
    console.log(id)

    this.api.getProceduresById(id).subscribe(
      (data: Procedure[]) => {
       console.log("getProcedureId ", data);
       this.procedure = data[0];
       console.log("getProcedureiD2 ", this.procedure);
      }, error => {
        console.log(error);
      });
  }

  shareExperience() {
    if (this.user == null){
      this.router.navigate(['/login']);
      return;
    }
    this.openModal2(this.experienceModal, 'lg');
   // this.openModal(RoleModalComponent, { roleName: "dd", procedureid:"", description: "", tag: "shareExperience", data: this.productsObservable });
  }

  askQuestion(item) {
    console.log(item)
    this.openModal2(this.questionModal, 'lg');
    //this.openModal(QuestionModalComponent, { roleName: "dd", procedureid: item['procedureID'], title: "",description: "", tag: "askQuestion", data: this.productsObservable });
  }

  askQuestion2() {
    if (this.user == null){
      this.router.navigate(['/login']);
      return;
    }
    console.log(this.procedure)
    this.openModal2(this.questionModal, 'lg');
    //this.openModal(QuestionModalComponent, { roleName: "dd", procedureid: this.procedure['procedureID'], title: "",description: "", tag: "askQuestion", data: this.productsObservable });
  }

  saveExperience(data) {
    console.log("PPP>>pppp ", data);
    console.log("PPP>>pppp238 ", this.user);
    console.log("PPP>>pppp238 ", this.user['user']['fullName']);
    this.api.saveExperience(data['procedureid'], this.user['user']['fullName'], data['description']).subscribe(
      data => {
          console.log(data);
          this.productsObservable = this.api.getProceduresById(this.procedureId);
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
    //this.procedureName = item;
    //this.productsObservable = this.api.getProceduresByName(this.procedureName);
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
         // this.productsObservable = this.api.getProceduresByName(this.procedureName);
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
          this.productsObservable = this.api.getProceduresById(this.procedureId);
          this.notifyService.showSuccess("Question submitted","Success")
      },
      error => {
        console.log("error => ", error);

      }
    );
  }

  submitComment(form: NgForm) {
    console.log("PPP>> ", form.value);
    console.log("PPP>> ", this.user['user']['userName']);
    console.log("PPP>> ", this.procedure);

    this.api.saveComment(this.experienceID, this.user['user']['userName'], form.value.description).subscribe(
      data => {
          console.log(data);
          this.modalService.dismissAll();
          this.productsObservable = this.api.getProceduresById(this.procedureId);
          this.notifyService.showSuccess("Question submitted","Success")
      },
      error => {
        console.log("error => ", error);

      }
    );
  }

  fileChangeEvent(files) {
    console.log(files);

    if (files.length === 0){
      this.filesAccepted = false;
      return;
    }

    var totalSize = 0;
    for (let i = 0; i < files.length; i++) {
      totalSize = totalSize + files[0]['size'] / 1000000;
    }

    if (files.length > 3) {
      this.filesAccepted = false;
      this.notifyService.showError("You can only upload a maximum of 3 photos", "Warning");
      return;
    }

    if (totalSize > 3) {
      this.filesAccepted = false;
      this.notifyService.showError("Image too large, maximum image size is 2mb", "Image too large");
      return
    }

    this.filesAccepted = true;
    this.files = files;
  }

  fileChangeEventQuestion(files) {
    console.log(files);

    if (files.length === 0){
      this.filesAccepted = false;
      return;
    }

    var totalSize = 0;
    for (let i = 0; i < files.length; i++) {
      totalSize = totalSize + files[0]['size'] / 1000000;
    }

    if (files.length > 3) {
      this.filesAccepted = false;
      this.notifyService.showError("You can only upload a maximum of 3 photos", "Warning");
      return;
    }

    if (totalSize > 3) {
      this.filesAccepted = false;
      this.notifyService.showError("Image too large, maximum image size is 2mb", "Image too large");
      return
    }

    this.filesAccepted = true;
    this.files = files;
  }

  submitExperience(form: NgForm){
    console.log(form.value);
    this.productsObservable.subscribe(x => {
      console.log(x);
    });

    let title = form.value.title;
    let completed = form.value.completed;
    let averagecost = form.value.averagecost;
    let description = form.value.description;
    let approve = form.value.approve;

    if (title == ''){
      this.notifyService.showError("Please enter title","Enter title");
      return;
    }

    if (completed == ''){
      this.notifyService.showError("Please confirm if you have done procedure","Have you done procedure?");
      return;
    }

    if (averagecost == ''){
      this.notifyService.showError("Please enter average cost","Enter average cost");
      return;
    }

    if (description == ''){
      this.notifyService.showError("Please enter description","Enter average description");
      return;
    }

    if (approve != true){
      this.notifyService.showError("Please accept our terms and conditions","Accept our terms");
      return;
    }
    const uploadData = new FormData();
    uploadData.append('procedureID', this.procedure['procedureID']);
    uploadData.append('category', this.procedure['procedureName']);
    uploadData.append('title', title);
    uploadData.append('completed', completed);
    uploadData.append('cost', averagecost);
    uploadData.append('description', description);

    if (this.filesAccepted){
      for(let i=0;i<this.files.length;i++){
        uploadData.append('thumbnail', this.files[i]);
      }
    }

    const options = {
      headers: new HttpHeaders()
        .set('Authorization', sessionStorage.getItem('token'))
    }

    this.loading = true;

    this.http.post(this.url + '/api/psm/experience/createexperience', uploadData, options)
      .subscribe(
        data => {
          this.loading = false;
          console.log("thedt ", data);
          this.modalService.dismissAll();
          this.productsObservable = this.api.getProceduresById(this.procedureId);
          this.notifyService.showSuccess("Added Experience", "Success");
        },
        error => {
          this.loading = false;
          this.notifyService.showError("Something went wrong, please try again", "Failed");
        }
      );
  }

  submitQuestion(form: NgForm){
    console.log(form.value);

    let title = form.value.titleQuestion;
    let description = form.value.descriptionQuestion;
    let approve = form.value.approveQuestion;

    if (title == ''){
      this.notifyService.showError("Please enter title","Enter title");
      return;
    }

    if (description == ''){
      this.notifyService.showError("Please enter description","Enter average description");
      return;
    }

    if (approve != true){
      this.notifyService.showError("Please accept our terms and conditions","Accept our terms");
      return;
    }
    const uploadData = new FormData();
    uploadData.append('procedureID', this.procedure['procedureID']);
    uploadData.append('category', this.procedure['procedureName']);
    uploadData.append('title', title);
    uploadData.append('description', description);

    if (this.filesAccepted){
      for(let i=0;i<this.files.length;i++){
        uploadData.append('thumbnail', this.files[i]);
      }
    }

    const options = {
      headers: new HttpHeaders()
        .set('Authorization', sessionStorage.getItem('token'))
    }

    this.loading = true;

    this.http.post(this.url + '/api/psm/question/createquestion', uploadData, options)
      .subscribe(
        data => {
          this.loading = false;
          console.log("thedt ", data);
          this.modalService.dismissAll();
          this.productsObservable = this.api.getProceduresById(this.procedureId);
          this.notifyService.showSuccess("Added Question", "Success");
        },
        error => {
          this.loading = false;
          this.notifyService.showError("Something went wrong, please try again", "Failed");
        }
      );
  }

  comment(item){
    console.log("OPOOOO",item)

    if (this.user == null){
      this.openModal2(this.loginCommentModal, 'lg');
      return;
    }
    this.experienceID = item;
    this.openModal2(this.commentModal, 'lg');
   // this.openModal(ExperienceCommentModalComponent, { experienceID: item,description: "", tag: "comment", data: this.productsObservable });
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

  back(){
    sessionStorage.clear();
    this.router.navigate(['/procedure']);
  }

  logOut(){
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
  login(){
    sessionStorage.clear();
    this.modalService.dismissAll();
    this.router.navigate(['/login']);
  }
}
