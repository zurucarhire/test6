import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})

// const getExternalImageFromURL = (requesturl: string): Promise<Blob> => {
//   const proxyurl = "https://cors-anywhere.herokuapp.com/";

//   return fetch(proxyurl + requesturl).then((res) => {
//       return res.blob();
//   });
// };

export class AccountComponent implements OnInit {
  @ViewChild("profileModal") profileModal: TemplateRef<any>;
  @ViewChild("documentsModal") documentsModal: TemplateRef<any>;

  modaltitle: string;
  modallabel: string;
  modalinputvalue: string;
  modaldocumentsidorpassport = false;
  closeResult: string;
  username: string;
  email: string;
  phone: string;
  idClicked = false;
  passportClicked = false;
  bankstatementsannualreturns: string;
  boardresolution: string;
  businesslicense: string;
  kracertificate: string;
  registrationcertificate: string;
  memorandumarticlesofassociation: string;
  idpassport: string;
  documentsavailable = false;
  loading = false;
  idpassportclicked = false;
  businesslicenseclicked = false;
  boardresolutionclicked = false;
  kracertificateclicked = false;
  bankstatementclicked = false;
  incorportaioncertificateclicked = false;
  memorandumclicked = false;
  idpassportfile: any;
  businesslicensefile: any;
  boardresolutionfile: any;
  kracertificatefile: any;
  bankstatementfile: any;
  incorportationcertificatefile: any;
  memorandumfile: any;
  customer: any;
  constructor(private router: Router,private notifyService: NotificationService, 
    private api: ApiService, private modalService: NgbModal, private http: HttpClient) { }

  ngOnInit(): void {
    this.customer = JSON.parse(sessionStorage.getItem('customer'));
    console.log('retrievedCustomer: ', this.customer);

    this.username = this.customer["username"];
    this.email = this.customer["email"];
    this.phone = this.customer["msisdn"];
    let idpassport = this.customer["idpassport"];

    if (idpassport != "nil"){
        this.documentsavailable = true;
        this.idpassport = idpassport;
        this.bankstatementsannualreturns = this.customer["bankstatementsannualreturns"];
        this.boardresolution = this.customer["boardresolution"];
        this.businesslicense = this.customer["businesslicense"];
        this.kracertificate = this.customer["kracertificate"];
        this.memorandumarticlesofassociation = this.customer["memorandumarticlesofassociation"];
        this.registrationcertificate = this.customer["registrationcertificate"];
    } else {
      this.documentsavailable = false;
    }
  }

  selectedTab(e: MatTabChangeEvent) {
    console.log(e.index);
    let index = e.index;

    if (index == 0) {
      
    } else if (index == 1) {
      
    } else if (index == 2) {
      
    }
  }

  openModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-holder', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  editPersonalInformation(title, label, value){
    console.log("hel ", title, value);
    this.modaltitle = title;
    this.modallabel = label;
    this.modalinputvalue = value;
    this.openModal(this.profileModal);
  }

  editDocuments(title, label, value){
    console.log("hel ", title, value);
    this.modaltitle = title;
    this.modallabel = label;
    this.modalinputvalue = value;
    if (label == "ID / Passport"){
      this.modaldocumentsidorpassport = true;
    } else {
      this.modaldocumentsidorpassport = false;
    }
    this.openModal(this.documentsModal);
  }

  editSubmit(form: NgForm, title, label) {
    console.log("zoom ",title, label);
    if (title == 'Edit Username' || title == "Edit Phone"){
      this.personalInfoEdit(form, label);
    } else {
      this.documentInfoEdit(form, label);
    }
  }

  personalInfoEdit(form: NgForm, tag) {
    let val = form.value.name;
    let key = '';
    console.log(val);
    console.log(tag);
    if (tag == 'Username') {
      if (val.length < 3) {
        this.notifyService.showError("Please enter a valid username", "Validation Error");
        return
      }
      key = 'username';
    } else if (tag == 'Phone') {
      if (val.length != 12) {
        this.notifyService.showError("Please enter a valid phone", "Validation Error");
        return
      }
      key = 'msisdn';
    }
    this.loading = true;

    //let customer = JSON.parse(sessionStorage.getItem('customer'));
    console.log('retrievedObject: ', this.customer);

    this.customer[key] = val;
    this.update("Personal Information", key, this.customer);
  }

  documentInfoEdit(form: NgForm, tag) {
    
    if (!this.idpassportclicked && !this.businesslicenseclicked && 
      !this.boardresolutionclicked && !this.kracertificateclicked &&
      !this.bankstatementclicked && !this.incorportaioncertificateclicked &&
      !this.memorandumclicked){
      this.notifyService.showError("Please upload file", tag);
      return
    }
    //let customer = JSON.parse(sessionStorage.getItem('customer'));
    console.log('retrievedObject00: ', this.customer);
    let val = '';
    let key = '';
    if (tag == "ID / Passport"){
      let fileLength = this.idpassportfile.length;
      if (this.idClicked){
        if (fileLength < 2){
          this.notifyService.showError("Please upload both ID Front and Back","ID/Passport");
          return;
        }
        val = this.idpassportfile[0].name + "," + this.idpassportfile[1].name;
        key = "idpassport";
      } else {
        val = this.idpassportfile[0].name;
        key = "idpassport"
      }
    } else if (tag == "Business License"){
      val = this.businesslicensefile[0].name;
      key = "businesslicense";
    } else if (tag == "Board Resolution"){
      val = this.boardresolutionfile[0].name;
      key = "boardresolution";
    } else if (tag == "KRA Certificate"){
      val = this.kracertificatefile[0].name;
      key = "boardresolution";
    } else if (tag == "Bank Statement"){
      val = this.bankstatementfile[0].name;
      key = "bankstatementsannualreturns";
    } else if (tag == "Incorporation Certificate"){
      val = this.incorportationcertificatefile[0].name;
      key = "registrationcertificate";
    } else if (tag == "Memorandum & Articles of Association"){
      val = this.memorandumfile[0].name;
      key = "memorandumarticlesofassociation";
    }

    console.log("the val ", val);

    console.log('retrievedObject: ', this.customer);
    this.customer[key] = val
    console.log('retrievedObject: ', this.customer);
    //customer[key] = val;
    this.updateDocuments("Documents", tag);
  }

  private update(title, key, customer) {
    this.api.updateCustomer(customer).subscribe(
      data => {
        console.log(data);
        sessionStorage.setItem('customer', JSON.stringify(data));
        this.loading = false;
        this.notifyService.showSuccess("Edit successful", title);
        
        if (key == "username"){
          this.username = data["username"]
        } else if (key == "msisdn"){
          this.phone = data["msisdn"]
        }
        this.modalService.dismissAll();
      },
      error => {
        this.loading = false;
        console.log("Update Profile Error ", error);
        this.notifyService.showError("Something went wrong, please try again", "Oops");
      }
    );
  }

  private updateDocuments(title, tag) {
    const uploadData = new FormData();


    if (tag == "ID / Passport"){
      if (this.idClicked == true) {
        uploadData.append('multiplefiles', "1");
        uploadData.append('file1', this.idpassportfile[0], this.idpassportfile[0].name);
        uploadData.append('file2', this.idpassportfile[1], this.idpassportfile[1].name);
      } else {
        uploadData.append('multiplefiles', "0");
        uploadData.append('file1', this.idpassportfile[0], this.idpassportfile[0].name);
        uploadData.append('file2', this.idpassportfile[0], this.idpassportfile[0].name);
      }
    } else if (tag == "Business License"){
        uploadData.append('multiplefiles', "0");
        uploadData.append('file1', this.businesslicensefile[0], this.businesslicensefile[0].name);
        uploadData.append('file2', this.businesslicensefile[0], this.businesslicensefile[0].name);
    } else if (tag == "Board Resolution"){
      uploadData.append('multiplefiles', "0");
      uploadData.append('file1', this.boardresolutionfile[0], this.boardresolutionfile[0].name);
      uploadData.append('file2', this.boardresolutionfile[0], this.boardresolutionfile[0].name);
    } else if (tag == "KRA Certificate"){
      uploadData.append('multiplefiles', "0");
      uploadData.append('file1', this.kracertificatefile[0], this.kracertificatefile[0].name);
      uploadData.append('file2', this.kracertificatefile[0], this.kracertificatefile[0].name);
    } else if (tag == "Bank Statement"){
      uploadData.append('multiplefiles', "0");
      uploadData.append('file1', this.bankstatementfile[0], this.bankstatementfile[0].name);
      uploadData.append('file2', this.bankstatementfile[0], this.bankstatementfile[0].name);
    } else if (tag == "Incorporation Certificate"){
      uploadData.append('multiplefiles', "0");
      uploadData.append('file1', this.incorportationcertificatefile[0], this.incorportationcertificatefile[0].name);
      uploadData.append('file2', this.incorportationcertificatefile[0], this.incorportationcertificatefile[0].name);
    } else if (tag == "Memorandum & Articles of Association"){
      uploadData.append('multiplefiles', "0");
      uploadData.append('file1', this.memorandumfile[0], this.memorandumfile[0].name);
      uploadData.append('file2', this.memorandumfile[0], this.memorandumfile[0].name);
    }

    uploadData.append('email', sessionStorage.getItem("email"));
    uploadData.append('tag', tag);
    
    this.loading = true;
    this.http.put('http://159.223.69.40:8082/api/customer/merchantdocumentsupdate', uploadData)
    //this.http.put('http://localhost:8082/api/customer/merchantdocumentsupdate', uploadData)
      .subscribe(
        data => {
          this.loading = false;

          this.idpassportclicked = false;
          this.businesslicenseclicked = false;
          this.boardresolutionclicked = false;
          this.bankstatementclicked = false;
          this.incorportaioncertificateclicked = false;
          this.kracertificateclicked = false;
          this.memorandumclicked = false;
          
          console.log(data);
          sessionStorage.setItem('customer', JSON.stringify(data));

          if (tag == "ID / Passport"){
            this.idpassport = data["idpassport"];
          } else if (tag == "Business License"){
            this.businesslicense = data["businesslicense"];
          } else if (tag == "Board Resolution"){
            this.boardresolution = data["boardresolution"];
          } else if (tag == "KRA Certificate"){
            this.kracertificate = data["kracertificate"];
          } else if (tag == "Bank Statement"){
            this.bankstatementsannualreturns = data["bankstatementsannualreturns"];
          } else if (tag == "Incorporation Certificate"){
            this.registrationcertificate = data["registrationcertificate"];
          } else if (tag == "Memorandum & Articles of Association"){
            this.memorandumarticlesofassociation = data["memorandumarticlesofassociation"];
          }
          this.notifyService.showSuccess("Your update is successful",tag);
          this.modalService.dismissAll();

        },
        error => {
          this.loading = false;
          console.log(error);
          this.notifyService.showError("Something went wrong","Retry");
        }
      );
  }

  idPassportEvent(e, item) {
    console.log(item);
    if (item == "ID") {
      this.idClicked = true;
      this.idpassportclicked = false;
      //this.modalinputvalue = this.customer["idpassport"];
      this.passportClicked = false;
    } else {
      this.passportClicked = true;
      this.idpassportclicked = false;
      //this.modalinputvalue = this.customer["idpassport"];
      this.idClicked = false;
    }
  }

  onFileChangedDocuments(event, title) {
    const selectedFile = event.target.files;
    console.log(selectedFile);
    console.log(title);
    console.log("gggg ",selectedFile.length);
    
    if (title == "ID / Passport"){
      if (this.idClicked){
        if (selectedFile.length < 2){
          this.notifyService.showError("Please enter both ID Front and Back","ID");
          return
        } else {
          this.modalinputvalue = selectedFile[0].name + "," + selectedFile[1].name;
        }
      } else {
        this.modalinputvalue = selectedFile[0].name;
      }
      this.idpassportfile = selectedFile;
      this.idpassportclicked = true;
    } else if (title == "Business License"){
      this.modalinputvalue = selectedFile[0].name;
      this.businesslicensefile = selectedFile;
      this.businesslicenseclicked = true;
    } else if (title == "Board Resolution"){
      this.modalinputvalue = selectedFile[0].name;
      this.boardresolutionfile = selectedFile;
      this.boardresolutionclicked = true;
    } else if (title == "KRA Certificate"){
      this.modalinputvalue = selectedFile[0].name;
      this.kracertificatefile = selectedFile;
      this.kracertificateclicked = true;
    } else if (title == "Bank Statement"){
      this.modalinputvalue = selectedFile[0].name;
      this.bankstatementfile = selectedFile;
      this.bankstatementclicked = true;
    } else if (title == "Incorporation Certificate"){
      this.modalinputvalue = selectedFile[0].name;
      this.incorportationcertificatefile = selectedFile;
      this.incorportaioncertificateclicked = true;
    } else if (title == "Memorandum & Articles of Association"){
      this.modalinputvalue = selectedFile[0].name;
      this.memorandumfile = selectedFile;
      this.memorandumclicked = true;
    }

    //this.businesslicensefile = selectedFile;
  }

  onFileChangedIdPassportValidate(event) {
    if (this.idClicked == false && this.passportClicked == false) {
      this.notifyService.showError("Please select ID or Passport", "Validation");
      return false;
    }
    
  }

  completeRegistration(){
    this.router.navigate(["merchantregistration"]);
  }

  emailNotifications(e){
    if (e.target.checked){
      this.notifyService.showSuccess("You have enabled email notifications","Email Notifications");
    } else {
      this.notifyService.showSuccess("You have disabled email notifications","Email Notifications");
    }
  }

  smsNotifications(e){
    if (e.target.checked){
      this.notifyService.showSuccess("You have enabled sms notifications","SMS Notifications");
    } else {
      this.notifyService.showSuccess("You have disabled sms notifications","SMS Notifications");
    }
  }

  newsletterNotifications(e){
    if (e.target.checked){
      this.notifyService.showSuccess("You have enabled newsletter","Newsletter");
    } else {
      this.notifyService.showSuccess("You have disabled newsletter","Newsletter");
    }
  }

   downloadUrl(url: string, fileName: string) {
    const a: any = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
  };
}
