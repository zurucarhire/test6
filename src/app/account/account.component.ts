import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/internal/Observable';
import { QuestionModalComponent } from '../modal/question-modal/question-modal.component';
import { RoleModalComponent } from '../modal/role-modal/role-modal.component';
import { Procedure } from '../model/procedure';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  profilephoto = "https://zuru.co.ke/profile_20220402015403.png"
  user: any;
  procedures: Procedure[];

  myusername;
  myfullname;

  productsObservable : Observable<any> ;
  experienceObservable : Observable<any> ;

  loading = false;

  url = "http://52.91.60.228:8090";
  //url = "http://localhost:8090";

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
    console.log("the user is ", this.user);
    this.myusername = this.user["user"]["userName"];
    this.myfullname = this.user["user"]["fullName"];
    console.log(this.user);
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
    this.openModal(RoleModalComponent, { roleName: "dd", procedureid:"",description: "", tag: "shareExperience", data: this.productsObservable });
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

  editAccount(tag){
    console.log("tag", tag);
    console.log("username", this.myusername);
    console.log("userid", this.user["user"]["userID"]);

    let value = this.myusername;
    if (tag == "username"){
      if (this.myusername.length == 0){
        this.notifyService.showError("Please enter username","Invalid username");
        return
      }
    } else if (tag == "fullname"){
      value = this.myfullname;
      if (this.myfullname.length == 0){
        this.notifyService.showError("Please enter full name","Invalid full name");
        return
      }
    }

    this.api.updateAccount(this.user["user"]["userID"], tag, value).subscribe(
      data => {
        this.notifyService.showSuccess(value + " updated successfully","Success");
        this.myusername = data["userName"];
        this.myfullname = data["fullName"];

        //sessionStorage.setItem('user', JSON.stringify(data));
        this.user["user"] = data;
        sessionStorage.setItem('user', JSON.stringify(this.user));
        console.log("data => ",data);
        console.log("data22 => ",JSON.parse(sessionStorage.getItem('user')));
      },
      error => {
        console.log("error => ",error);
        this.notifyService.showError("Something went wrong", "Oops");
      }
    );

  }

  changePassword(form: NgForm){
    let oldpassword = form.value.oldpassword;
    let newpassword = form.value.newpassword;
    let confirmpassword = form.value.confirmpassword;

    console.log(form.value);
    console.log(oldpassword);
    console.log(newpassword);
    console.log(confirmpassword);

    if (oldpassword == "" || newpassword == "" || confirmpassword == ""){
      this.notifyService.showError("please enter all values","Invalid");
      return
    }

    if (newpassword != confirmpassword){
      this.notifyService.showError("Passwords do not match","Invalid passwords");
      return
    }

    this.api.changePass(this.user["user"]["userID"],oldpassword, newpassword, confirmpassword).subscribe(
      data => {
        form.resetForm()
        this.notifyService.showSuccess("Password changed successful","Success");
      },
      error => {
        console.log("error => ",error);
        this.notifyService.showError("Old password is incorrect", "Old Password Incorrect");
      }
    );
  }

  fileChangeEvent(tag, files) {
    const selectedFile = files[0];

    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', selectedFile, selectedFile.name);
    uploadImageData.append('userId', this.user["user"]["userID"]);
    //this.http.put('http://localhost:8085/api/zuru/user/uploadpic', uploadImageData, options)
    this.http.put(this.url+'/api/psm/user/uploadpic', uploadImageData)
      .subscribe(
        data => {
          console.log("data -> ", data);
          console.log("data ->>: ", tag);
          this.user["user"] = data;
          sessionStorage.setItem('user', JSON.stringify(this.user));
          this.notifyService.showSuccess("Your " + tag + " has been changed","Success");
          this.profilephoto = this.url+"/"+data["profilephoto"];
        },
        error => console.log(error)
      );

  }
  logOut(){
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}

