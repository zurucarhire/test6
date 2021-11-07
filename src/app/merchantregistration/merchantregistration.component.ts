import { Component, NgZone, OnInit } from '@angular/core';
import { fn } from '@angular/compiler/src/output/output_ast';
declare var jQuery: any;
import * as $ from 'jquery';
import { NotificationService } from '../service/notification.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-merchantregistration',
  templateUrl: './merchantregistration.component.html',
  styleUrls: ['./merchantregistration.component.css']
})
export class MerchantregistrationComponent implements OnInit {

  constructor(private zone: NgZone, private router: Router, private notifyService: NotificationService,
    private http: HttpClient) { }
  phone: string;
  loading: boolean = false;
  windowRef: any;
  verificationCode: string;
  user: any;
  emailphoneverification = false;
  phoneverification = false;
  idnumberkrapinverification = false;
  email_is_edit = false;
  phone_is_edit = false;
  personalinfoprevious = false;
  documentinfoprevious = false;
  refereephone;
  refereecode: string;
  affiliatepartnercode: string;
  sourceoffunds: string;
  partnercode: string;
  token = "123";
  idClicked = false;
  passportClicked = false;
  statementAnnualReturnsFile: any;
  idPassportFile: any;
  memorandumArticlesOfAssociationFile: any;
  certificateOfIncorporationFile: any;
  kraCertificateFile: any;
  businessLicenseFile: any;
  boardResolutionFile: any;

  //reg = this.register;
  ngOnInit(): void {

    this.zone.run(() => {

      var scope = this;
      var current_fs, next_fs, previous_fs; //fieldsets

      var animating;
      var left, opacity, scale;
      var counter = 1;
      $(".next").click(function () {
        console.log("hello ", counter)
        if (animating) return false;
        animating = true;
        current_fs = $(this).parent();

        if (counter == 1) {
          let vals = current_fs.closest('form').find(".step1");
          let statementAnnualReturns = vals[0].files;
          let idPassport = vals[1].files;

          if (statementAnnualReturns['length'] == 0) {
            scope.notifyService.showError("Please upload certified bank statement or annual returns", "Validation");
            animating = false;
            return;
          }

          if (idPassport['length'] == 0) {
            scope.notifyService.showError("Please upload ID or Passport", "Validation");
            animating = false;
            return;
          }

          if (scope.idClicked == true) {
            if (idPassport["length"] == 1) {
              scope.notifyService.showError("Please upload both ID Front and Back", "Validation");
              animating = false;
              return;
            }
          }

          scope.statementAnnualReturnsFile = statementAnnualReturns;
          scope.idPassportFile = idPassport;

          console.log("statementAnnualReturnsFile -> ", scope.statementAnnualReturnsFile[0]);
          console.log("idPassportFile -> ", scope.idPassportFile[0]);
          console.log("idPassportFile2 -> ", scope.idPassportFile[1]);
        } else if (counter == 2) {
          console.log("hello2 ", counter)
          let vals = current_fs.closest('form').find(".step2");
          let memorandumArticlesOfAssociation = vals[0].files;
          let certificateOfIncorporation = vals[1].files;
          console.log("hello3 ", memorandumArticlesOfAssociation)
          if (memorandumArticlesOfAssociation['length'] == 0) {
            scope.notifyService.showError("Please upload memorandum and articles of associations (CR12)", "Validation");
            animating = false;
            return;
          }

          if (certificateOfIncorporation['length'] == 0) {
            scope.notifyService.showError("Please upload certificate of incorporation", "Validation");
            animating = false;
            return;
          }

          scope.memorandumArticlesOfAssociationFile = memorandumArticlesOfAssociation;
          scope.certificateOfIncorporationFile = certificateOfIncorporation;

          console.log("memorandumArticlesOfAssociationFile -> ", scope.memorandumArticlesOfAssociationFile[0]);
          console.log("certificateOfIncorporationFile -> ", scope.certificateOfIncorporationFile[0]);
        } else if (counter == 3) {

        }


        next_fs = $(this).parent().next();
        counter = counter + 1;
        //activate next step on progressbar using the index of next_fs
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style

        current_fs.animate({ opacity: 0 }, {
          step: function (now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale current_fs down to 80%
            scale = 1 - (1 - now) * 0.2;
            //2. bring next_fs from the right(50%)
            left = (now * 50) + "%";
            //3. increase opacity of next_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({
              'transform': 'scale(' + scale + ')',
              'position': 'absolute'
            });
            next_fs.css({ 'left': left, 'opacity': opacity });
          },
          duration: 300,
          complete: function () {
            current_fs.hide();
            animating = false;
          },
          //this comes from the custom easing plugin
          //easing: 'easeInOutBack'
        });
      });

      $(".previous").click(function () {
        if (animating) return false;
        animating = true;

        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();
        counter = counter - 1;
        //de-activate current step on progressbar
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

        //show the previous fieldset
        previous_fs.show();
        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
          step: function (now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale previous_fs from 80% to 100%
            scale = 0.8 + (1 - now) * 0.2;
            //2. take current_fs to the right(50%) - from 0%
            left = ((1 - now) * 50) + "%";
            //3. increase opacity of previous_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({ 'left': left });
            previous_fs.css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
          },
          duration: 300,
          complete: function () {
            current_fs.hide();
            animating = false;
          },
          //this comes from the custom easing plugin
          // easing: 'easeInOutBack'
        });
      });

      $(".submit").click(function () {
        
        let vals = current_fs.closest('form').find(".step3");
        let kraCertificate = vals[0].files;
        let businessLicense = vals[1].files;
        let boardResolution = vals[2].files;

        if (kraCertificate['length'] == 0) {
          scope.notifyService.showError("Please upload KRA Certificate", "Validation");
          animating = false;
          return;
        }

        if (businessLicense['length'] == 0) {
          scope.notifyService.showError("Please upload business license", "Validation");
          animating = false;
          return;
        }

        if (boardResolution['length'] == 0) {
          scope.notifyService.showError("Please upload board resolution", "Validation");
          animating = false;
          return;
        }

        scope.kraCertificateFile = kraCertificate;
        scope.businessLicenseFile = businessLicense;
        scope.boardResolutionFile = boardResolution;

        console.log("kraCertificateFile -> ", scope.kraCertificateFile[0]);
        console.log("businessLicenseFile -> ", scope.businessLicenseFile[0]);
        console.log("boardResolutionFile -> ", scope.boardResolutionFile[0]);
        scope.submit();
      })

    });
  }

  submit() {
    const uploadData = new FormData();

    if (this.idClicked == true) {
      uploadData.append('isidorpassport', "id");
      uploadData.append('idpassport1', this.idPassportFile[0], this.idPassportFile[0].name);
      uploadData.append('idpassport2', this.idPassportFile[1], this.idPassportFile[1].name);
    } else {
      uploadData.append('isidorpassport', "passport");
      uploadData.append('idpassport1', this.idPassportFile[0], this.idPassportFile[0].name);
      uploadData.append('idpassport2', this.idPassportFile[0], this.idPassportFile[0].name);
    }

    uploadData.append('email', sessionStorage.getItem("email"));
    uploadData.append('bankstatementsannualreturns', this.statementAnnualReturnsFile[0], this.statementAnnualReturnsFile[0].name);
    uploadData.append('memorandumarticlesofassociation', this.memorandumArticlesOfAssociationFile[0], this.memorandumArticlesOfAssociationFile[0].name);
    uploadData.append('kracertificate', this.kraCertificateFile[0], this.kraCertificateFile[0].name);
    uploadData.append('registrationcertificate', this.certificateOfIncorporationFile[0], this.certificateOfIncorporationFile[0].name);
    uploadData.append('businesslicense', this.businessLicenseFile[0], this.businessLicenseFile[0].name);
    uploadData.append('boardresolution', this.boardResolutionFile[0], this.boardResolutionFile[0].name);
    
    this.loading = true;
    this.http.post('http://159.223.69.40:8082/api/customer/merchantregistration', uploadData)
    //this.http.post('http://localhost:8082/api/customer/merchantregistration', uploadData)
      .subscribe(
        data => {
          this.loading = false;
          console.log(data);
          sessionStorage.setItem('customer', JSON.stringify(data));
          this.notifyService.showSuccess("Your registration is successful","Success");
          this.router.navigate(['/home']);
        },
        error => {
          this.loading = false;
          console.log(error);
          this.notifyService.showError("Something went wrong","Retry");
        }
      );
  }
  
  private base64ToFile(tag, base64) {
    let d = new Date();
    let img = base64.split(",")[1];
    const imageBlob = this.dataURItoBlob(img);
    const imageFile = new File([imageBlob], tag + d.getTime()+ "" + Math.floor(Math.random() * 100) + ".png", { type: 'image/png' });
    return imageFile;
  }
  private dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });    
    return blob;
  }

  IdPassportEvent(e, item) {
    console.log(item);
    if (item == "ID") {
      this.idClicked = true;
      this.passportClicked = false;
    } else {
      this.passportClicked = true;
      this.idClicked = false;
    }
  }

  onFileChangedStatementAnnualReturns(event) {
    const selectedFile = event.target.files[0];

  }

  onFileChangedIdPassportValidate(event) {

    if (this.idClicked == false && this.passportClicked == false) {
      this.notifyService.showError("Please select ID or Passport", "Validation");
      return false;
    }
  }

  onFileChangedIdPassport(event) {
    const selectedFile = event.target.files[0];
    const selectedFile2 = event.target.files[1];

  }

  onFileChangedMemorandumArticlesOfAssociation(event) {

  }

  onFileChangedCertificateOfIncorporation(event) {

  }

  onFileChangedKraCertificate(event) {

  }

  onFileChangedBusinessLicense(event) {

  }

  onFileChangedBoardResolution(event) {

  }
}


