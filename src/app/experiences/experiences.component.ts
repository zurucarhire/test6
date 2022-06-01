import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/internal/Observable';
import { ExperienceCommentModalComponent } from '../modal/experience-comment-modal/experience-comment-modal.component';
import { QuestionModalComponent } from '../modal/question-modal/question-modal.component';
import { RoleModalComponent } from '../modal/role-modal/role-modal.component';
import { Procedure } from '../model/procedure';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.css']
})
export class ExperiencesComponent implements OnInit {
  closeResult: string;
  loading = false;
  files: any;
  filesAccepted: boolean = false;
  @ViewChild("experienceModal") experienceModal: TemplateRef<any>;
  user: any;
  procedures: Procedure[];

  url = "http://52.91.60.228:8090";
  //url: string = "http://localhost:8090";

   productsObservable : Observable<any> ;
   experienceObservable : Observable<any> ;

  @ViewChild("mainContent")
  private mainContentDiv!: ElementRef<HTMLElement>;

  constructor(private api: ApiService, private router: Router,
    private modalService: NgbModal,private notifyService: NotificationService,
    private http: HttpClient) {

    }

  ngOnInit(): void {
    this.experienceObservable = this.api.get_experiences();
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

  openModal2(content, size) {
    this.modalService.open(content, { size: size, ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-holder', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

    this.api.getProceduresByCategory(category).subscribe(
      (data: Procedure[]) => {
        let count: number = 1;
        this.procedures.length = 0;
        this.procedures = data;
      }, error => {
        console.log(error);
      });
  }

  findProcedureByName(name: string) {
    console.log(name)

    this.api.getProceduresByName(name).subscribe(
      (data: Procedure[]) => {
        this.procedures.length = 0;
        this.procedures = data;
      }, error => {
        console.log(error);
      });
  }

  moreDetail2(item){
    console.log("item -> ", item);
    this.router.navigate(['/singleprocedure',item]);
  }



  shareExperience() {
    if (this.user == null){
      this.router.navigate(['/login']);
      return;
    }
    this.openModal2(this.experienceModal, 'lg');
    //this.openModal(RoleModalComponent, { roleName: "dd", procedureid:"",description: "", tag: "shareExperience", data: this.productsObservable });
  }

  askQuestion(item) {
    console.log(item)
    this.openModal(QuestionModalComponent, { roleName: "dd", procedureid: item['procedureID'],description: "", tag: "askQuestion", data: this.productsObservable });
  }

  saveExperience(data) {
    console.log("PPP>> ", data);
    this.api.saveExperience(data['procedureid'], "joe", data['description']).subscribe(
      data => {
          console.log(data);
          this.notifyService.showSuccess("Experience submitted","Success")
          this.experienceObservable = this.api.get_experiences();
      },
      error => {
        console.log("error => ", error);

      }
    );
  }

  saveQuestion(data) {
    console.log("PPP>> ", data);
    this.api.saveQuestion(data['procedureid'],"", data['description'],data['description']).subscribe(
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

  submitExperience(form: NgForm){
    console.log(form.value);

    let procedure = form.value.procedure;
    let title = form.value.title;
    let completed = form.value.completed;
    let averagecost = form.value.averagecost;
    let description = form.value.description;
    let approve = form.value.approve;

    if (procedure == ''){
      this.notifyService.showError("Please enter category","Enter category");
      return;
    }

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
    let procedureID = procedure.split(":")[0];
    let category = procedure.split(":")[1];
    const uploadData = new FormData();
    uploadData.append('procedureID', procedureID);
    uploadData.append('category', category);
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
          this.notifyService.showSuccess("Added Experience", "Success");
        },
        error => {
          this.loading = false;
          this.notifyService.showError("Something went wrong, please try again", "Failed");
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

  closeModal(){
    this.modalService.dismissAll();
  }

  logOut(){
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
