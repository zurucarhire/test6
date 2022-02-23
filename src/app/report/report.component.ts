import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { Iprsrequest } from '../model/iprsrequest';
import { User } from '../model/user';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';
declare var $;
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  @ViewChild("searchLogsModal") searchLogsModal: TemplateRef<any>;

  tabIndex = 0;
  loading = false;
  myDatesArray = [];
  startdatemodel;
  enddatemodel;
  minDate: Date;
  maxDate: Date = new Date();

  closeResult: string;

  searchLogsDatatable:any;
  iprsRequestsDatatable:any;
  customerRecordsDatatable:any;

  requesttypedata: any;
  userdata: any;

  tabPosition = 0;
  iprsrequeststartdate: string;
  iprsrequestenddate: string;

  data = [];
  dtOptionsSearchLogs: any;
  dtOptionsIprsRequests: any;
  dtOptionsCustomerRecords: any;
  dtOptionsDiscrepantRecords: any;
  dtOptionsRefreshedRecords: any;


  placeofbirthvalue: string;
  placeofdeathvalue: string;
  placeoflivevalue: string;
  dateofbirthvalue: string;
  dateofdeathvalue: string;
  dateofissuevalue: string;

  requestfromdate: string;
  requesttodate: string;

  myHolidayFilter = (d: Date): boolean => {
    const time = d.getTime();
    return !this.myDatesArray.find(x => x.getTime() == time);
  }

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute,
    private modalService: NgbModal, private notifyService: NotificationService) {
  }

  ngOnInit(): void {
    this.fetchAsync();

    //this.initSearchLogsDatatables([]);
    this.activatedRoute.queryParams.subscribe(
      params => {
        console.log("ggg",params);
        let value = params['value'];
        if (value == 'search logs'){
          this.tabIndex = 0
        } else if (value == 'iprs requests'){
          this.tabIndex = 1
        } else if (value == 'customer records'){
          this.tabIndex = 2
        }
      }
    )
  }

  openModal(content) {
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-holder', centered: true }).result.then((result) => {
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

  ngAfterViewInit(): void{
    if (this.tabIndex == 0){
      this.initIprsRequestsDatatables([]);

    } else if (this.tabIndex == 1){
      this.initSearchLogsDatatables([]);
    } else if (this.tabIndex == 2){
      this.initCustomerRecordsDatatables([]);
    }
  }

  fetchAsync() {
    let users = this.api.findAllUsers();
    let requestTypes = this.api.findAllActiveRequestTypes();
    forkJoin([users, requestTypes]).subscribe(results => {
      console.log("results 1 => ", results);
      this.userdata = results[0];
      this.requesttypedata = results[1];
      console.log("results 1 => ", this.userdata);
      console.log("results 2 => ", this.requesttypedata);
    });
    ///this.fundChart(data);
  }

  getSearchLogs(value){
    let startDate = value.refreshedrequeststartdate;
    let endDate = value.refreshedrequestenddate;
    let requestedBy= value.refreshedrequestedby;
    let requestType= value.refreshedrequesttype;
    let requestNumber = value.refreshedrequestnumber;
    let requestSerialNumber = value.refreshedrequestserialnumber;

    this.api.findRequests(this.requestfromdate,this.requesttodate, "REFRESHED_LOG", requestType, requestNumber,requestSerialNumber,requestedBy).subscribe(
      (data: Iprsrequest[]) => {
        if (data.length == 0){
          this.notifyService.showError("No data available", "Empty");
        }
        this.searchLogsDatatable.clear().rows.add(data).draw();
    }, error => {
      console.log(error);
    });
  }

  getIprsRequests(value){
    let startDate = value.iprsrequeststartdate;
    let endDate = value.iprsrequestenddate;
    let requestedBy= value.iprsrequestedby;
    let requestType= value.iprsrequesttype;
    let requestNumber = value.iprsrequestnumber;
    let requestSerialNumber = value.iprsrequestserialnumber;

    this.api.findRequests(this.requestfromdate,this.requesttodate, "IPRS_REQUEST_LOG", requestType, requestNumber,requestSerialNumber,requestedBy).subscribe(
      (data: Iprsrequest[]) => {
        if (data.length == 0){
          this.notifyService.showError("No data available", "Empty");
        }
        this.iprsRequestsDatatable.clear().rows.add(data).draw();
    }, error => {
      console.log(error);
    });
  }

  getCustomerRecords(value){
    let startDate = value.customerrequeststartdate;
    let endDate = value.customerrequestenddate;
    let requestedBy= value.customerrequestedby;
    let requestType= value.customerrequesttype;
    let requestNumber = value.customerrequestnumber;
    let requestSerialNumber = value.customerrequestserialnumber;

    this.api.findRequests(this.requestfromdate,this.requesttodate, "CUSTOMER_REQUEST_LOG", requestType, requestNumber,requestSerialNumber,requestedBy).subscribe(
      (data: Iprsrequest[]) => {
        if (data.length == 0){
          this.notifyService.showError("No data available", "Empty");
        }
        this.customerRecordsDatatable.clear().rows.add(data).draw();
    }, error => {
      console.log(error);
    });
  }

  getDiscrepantRecords(){
    this.api.findAllUsers().subscribe(
      (data: User[]) => {
        this.data = data;
        this.initDiscrepantRecordsDatatables(data);
    }, error => {
      console.log(error);
    });
  }

  getRefreshedRecords(){
    this.api.findAllUsers().subscribe(
      (data: User[]) => {
        this.data = data;
        this.initRefreshedRecordsDatatables(data);
    }, error => {
      console.log(error);
    });
  }

  initSearchLogsDatatables(data) {
    console.log("qwqwee ", data);
    let dtOptionsSearchLogs = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
      lengthMenu: [5, 10],
      dom:'Blfrtip',
      buttons: [
        {
          extend: 'excel',
          exportOptions: {
              columns: [ 0, 1, 2, 3, 4 ]
          }
        }
      ],
      columns: [
        {
          data: null,
          className: 'details-control',
          defaultContent: '',
          responsivePriority: 1
      },
        {
          title: 'ID Number',
          data: 'idnumber',
          className: "text-center"
        },
        {
          title: 'Serial Number',
          data: 'idserialNumber',
          className: "text-center"
        },
        {
          title: 'Pin',
          data: 'pin',
          className: "text-center"
        },
        {
          title: 'First Name',
          data: 'firstName',
          className: "text-center"
        },
        {
          title: 'Other Name',
          data: 'otherName',
          className: "text-center"
        },
        {
          title: 'Sur Name',
          data: 'surName',
          className: "text-center"
        },
        {
          title: 'Family',
          data: 'family',
          className: "text-center"
        },
        {
          title: 'Gender',
          data: 'gender',
          className: "text-center"
        },
        {
          title: 'Citizenship',
          data: 'citizenship',
          className: "text-center"
        },
        {
          title: 'Occupation',
          data: 'occupation',
          className: "text-center"
        }
      ]
    };

    this.searchLogsDatatable = $('#dtSearchLogs').DataTable(dtOptionsSearchLogs);

    let scope = this;
    $('#dtSearchLogs tbody').on('click', 'td.details-control', function () {
      var tr = $(this).closest('tr');
      var row = scope.searchLogsDatatable.row(tr);
      console.log("hooray")
      scope.placeofbirthvalue = row.data()['placeOfBirth'];
      scope.placeofdeathvalue = row.data()['placeOfDeath'];
      scope.placeoflivevalue = row.data()['placeOfLive'];
      scope.dateofbirthvalue = row.data()['dateOfBirth'];
      scope.dateofdeathvalue = row.data()['dateOfDeath'];
      scope.dateofissuevalue = row.data()['dateOfIssue'];
      //scope.openModal(scope.searchLogsModal);
      if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass('shown');
      } else {
        // Open this row
        row.child(format(row.data())).show();
        tr.addClass('shown');
      }
  });

  function format(d) {
    // `d` is the original data object for the row
    //let userorder = [] ;
    console.log("pi>>> ", d.surName);

    let dRow = '';
    dRow = dRow + '<tbody><tr>' +
      '<td>' + d.dateOfBirth + '</td>' +
      '<td>' + d.dateOfDeath + '</td>' +
      '<td>' + d.dateOfIssue + '</td>' +
      '<td>' + d.passportExpiryDate + '</td>' +
      '<td>' + d.placeOfBirth + '</td>' +
      '</tr></tbody>';

    return '<table class="table "><thead class="thead-dark"><tr><th scope="col">Date Of Birth</th><th scope="col">PDate Of Death</th><th scope="col">Date Of Issue</th><th scope="col">Passport Expiry</th><th scope="col">Place</th></tr></thead>' + dRow + '</table>';
  }
  }

  initIprsRequestsDatatables(data) {
    console.log("qwqwee 00", data);
    let dtOptions = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
      lengthMenu: [5, 10],
      dom:'Blfrtip',
      buttons: [
        {
          extend: 'excel',
          exportOptions: {
              columns: [ 0, 1, 2, 3, 4]
          }
        }
      ],
      columns: [
        {
          title: 'Username',
          data: 'userName',
          className: "text-center"
        },
        {
          title: 'Request Type',
          data: 'requestType',
          className: "text-center"
        },
        {
          title: 'Request Number',
          data: 'requestNumber',
          className: "text-center"
        },
        {
          title: 'Request Serial Number',
          data: 'requestSerialNumber',
          className: "text-center"
        },
        {
          title: 'Date Created',
          data: 'dateCreated',
          className: "text-center"
        },
      ]
    };
    this.iprsRequestsDatatable = $('#dtIprsRequests').DataTable(dtOptions);
  }

  initCustomerRecordsDatatables(data) {
    console.log("qwqwee 00", data);
    let dtOptions = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
      lengthMenu: [5, 10],
      dom:'Blfrtip',
      buttons: [
        {
          extend: 'excel',
          exportOptions: {
              columns: [ 0, 1, 2, 3, 4 ]
          }
        }
      ],
      columns: [
        {
          data: null,
          className: 'details-control',
          defaultContent: '',
          responsivePriority: 1
      },
        {
          title: 'ID Number',
          data: 'idnumber',
          className: "text-center"
        },
        {
          title: 'Serial Number',
          data: 'idserialNumber',
          className: "text-center"
        },
        {
          title: 'Pin',
          data: 'pin',
          className: "text-center"
        },
        {
          title: 'First Name',
          data: 'firstName',
          className: "text-center"
        },
        {
          title: 'Other Name',
          data: 'otherName',
          className: "text-center"
        },
        {
          title: 'Sur Name',
          data: 'surName',
          className: "text-center"
        },
        {
          title: 'Family',
          data: 'family',
          className: "text-center"
        },
        {
          title: 'Gender',
          data: 'gender',
          className: "text-center"
        },
        {
          title: 'Citizenship',
          data: 'citizenship',
          className: "text-center"
        },
        {
          title: 'Occupation',
          data: 'occupation',
          className: "text-center"
        }
      ]
    };

    this.customerRecordsDatatable = $('#dtCustomerRecords').DataTable(dtOptions);

    let scope = this;
    $('#dtCustomerRecords tbody').on('click', 'td.details-control', function () {
      var tr = $(this).closest('tr');
      var row = scope.customerRecordsDatatable.row(tr);

      if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass('shown');
      } else {
        // Open this row
        row.child(format2(row.data())).show();
        tr.addClass('shown');
      }
  });

  function format2(d) {
    // `d` is the original data object for the row
    let dRow = '';
    dRow = dRow + '<tbody><tr>' +
      //'<td><img height="50%" width="50%" src="'+photo+'"/></td>' +
      '<td>' + d.dateOfBirth + '</td>' +
      '<td>' + d.dateOfDeath + '</td>' +
      '<td>' + d.dateOfIssue + '</td>' +
      '<td>' + d.passportExpiryDate + '</td>' +
      '<td>' + d.placeOfBirth + '</td>' +
      '<td>' + d.placeOfLive + '</td>' +
      '<td>' + d.placeOfDeath + '</td>' +
      '<td>' + d.dateCreated + '</td>' +
      '<td>' + d.regOffice + '</td>' +
      '</tr></tbody>';

    return '<table class="table "><thead class="thead-dark"><tr><th scope="col">Birth Date</th><th scope="col">Death Date</th><th scope="col">Issue Date</th><th scope="col">Passport Expiry</th><th scope="col">Birth Place</th><th scope="col">Live Place</th><th scope="col">Death Place</th><th scope="col">Date Created</th><th scope="col">Reg Office</th></tr></thead>' + dRow + '</table>';
  }
  }

  initDiscrepantRecordsDatatables(data) {
    console.log("qwqwee ", data);
    this.dtOptionsDiscrepantRecords = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
      lengthMenu: [5, 10],
      columns: [
        {
          title: 'User Name',
          data: 'clientname',
          className: "text-center"
        },
        {
          title: 'Login Time',
          data: 'emailaddress',
          className: "text-center"
        },
        {
          title: 'Discrepant Records',
          data: 'emailaddress',
          className: "text-center"
        }
      ]
    };

    $('#dtDiscrepantRecords').DataTable(this.dtOptionsDiscrepantRecords);
  }

  initRefreshedRecordsDatatables(data) {
    console.log("qwqwee ", data);
    this.dtOptionsRefreshedRecords = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
      lengthMenu: [5, 10],
      columns: [
        {
          title: 'User Name',
          data: 'clientname',
          className: "text-center"
        },
        {
          title: 'Login Time',
          data: 'emailaddress',
          className: "text-center"
        },
        {
          title: 'Refreshed Records',
          data: 'emailaddress',
          className: "text-center"
        }
      ]
    };

    $('#dtRefreshedRecords').DataTable(this.dtOptionsRefreshedRecords);
  }
  selectedTab(e: MatTabChangeEvent) {
    console.log(e.index);
    console.log(88);
    let index = e.index;
    if (index == 0) {
      if (this.iprsRequestsDatatable == null || this.iprsRequestsDatatable == undefined ){
        this.initIprsRequestsDatatables([]);
      }
    } else if (index == 1) {
      if (this.searchLogsDatatable == null || this.searchLogsDatatable == undefined ){
        this.initSearchLogsDatatables([]);
       }

    } else if (index == 2) {
      if (this.customerRecordsDatatable == null || this.customerRecordsDatatable == undefined ){
        this.initCustomerRecordsDatatables([]);
      }
    } else if (index == 3) {
      this.getDiscrepantRecords();
    } else if (index == 4) {
      this.getRefreshedRecords();
    }
  }

  searchLogsSubmit(form: NgForm) {
    console.log(1)
    console.log(form.value);
    this.getSearchLogs(form.value);
  }

  iprsRequestSubmit(form: NgForm) {
    console.log(2)
    console.log(form.value);
    this.getIprsRequests(form.value);
  }

  customerRecordsSubmit(form: NgForm) {
    console.log(2)
    console.log(form.value);
    this.getCustomerRecords(form.value);
  }

  fromDateEvent(e) {
    console.log(e);
    const momentDate = new Date("Wed Feb 02 2022");
    console.log(momentDate);
    let fromDate = e.toLocaleDateString('en-US', {timeZone: 'EAT'});
    console.log(fromDate);
    let formatFromDate = fromDate.split("/");
    let day = formatFromDate[1].length == 2 ? formatFromDate[1] : "0"+formatFromDate[1];
    let month = formatFromDate[0].length == 2 ? formatFromDate[0] : "0"+formatFromDate[0];
    let year = formatFromDate[2];
    let dte = year+month+day;
    console.log(day);
    console.log(month);
    console.log(dte);
    // let day = formatFromDate[0].length() == 1 ?
     this.requestfromdate = dte;
  }

  toDateEvent(e) {
    console.log(e);
    let toDate = e.toLocaleDateString('en-US', {timeZone: 'EAT'});


    var today = new Date(toDate);
    var tomorrow = new Date(today);
    tomorrow.setDate(today.getDate()+1);
    tomorrow.toLocaleDateString();

    console.log(tomorrow)
    let tomorrowDate = tomorrow.toLocaleDateString('en-US', {timeZone: 'EAT'});
    let formatTomorrowDate = tomorrowDate.split("/");
    let day = formatTomorrowDate[1].length == 2 ? formatTomorrowDate[1] : "0"+formatTomorrowDate[1];
    let month = formatTomorrowDate[0].length == 2 ? formatTomorrowDate[0] : "0"+formatTomorrowDate[0];
    let year = formatTomorrowDate[2];
    let dte = year+month+day;
    console.log(day);
    console.log(month);
    console.log(dte);
    // let day = formatFromDate[0].length() == 1 ?
     this.requesttodate = dte;
  }

  requestTypeSelectOnChange(e){
    console.log(e);

  }

  requestedBySelectOnChange(e){
    console.log(e);

  }
}
