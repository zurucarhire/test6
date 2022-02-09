import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/user';
import { ApiService } from '../service/api.service';
declare var $;

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {
  public tabIndex = 0;
  data = [];
  dtOptionsUserLogs: any;
  dtOptionsChangeLogs: any;
  constructor(private api: ApiService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(
      params => {
        console.log("ggg",params);
        let value = params['value'];
        if (value == 'user logs'){
          this.tabIndex = 0
          //this.intd();
        } else if (value == 'change logs'){
          this.tabIndex = 1
          //this.getChangeLogs();
        } else {
          console.log("gggkkkk",params);
          this.tabIndex = 0
          //this.getUserLogs();
        }
      }
    )
  }

  ngAfterViewInit(){
    if (this.tabIndex == 0){
      this.intd();
    } else if (this.tabIndex == 1){
      this.intd2();
    } else {
      this.intd();
    }
  }

  getUserLogs(){
    this.intd();
  }

  getChangeLogs(){
    this.intd2();
  }

  intd(){
    $('#dtLoginLogs').DataTable({
      destroy: true,
      dom:'Blfrtip',
      buttons: [
        {
          extend: 'excel',
          exportOptions: {
              columns: [ 0, 1, 2, 3, 4 ]
          }
        }
      ],
      'ajax': {
        "beforeSend": function (xhr) {
          xhr.setRequestHeader("Authorization",
          "Bearer " + sessionStorage.getItem('accesstoken'))
        },
        'contentType': 'application/json',
        'url': 'http://localhost:8090/api/iprs/loginlog/findall',
        'type': 'POST',
        'data': function(d) {
          console.log("helloll ", JSON.stringify(d));
          return JSON.stringify(d);
        }
      },
      'serverSide' : true,
      columns : [{
        title: 'Login Time',
        data: 'loginTime',
        className: "text-center"
      },{
        title: 'Logout Time',
        data: 'logoutTime',
        className: "text-center"
      },
      {
        title: 'Login IP',
        data: 'loginIP',
        className: "text-center"
      },
      {
        title: 'Attempts Before Login',
        data: 'attemptsBeforeLogin',
        className: "text-center"
      }]
    });
  }

  intd2(){
    $('#dtChangeLogs').DataTable({
      destroy: true,
      dom:'Blfrtip',
      buttons: [
        {
          extend: 'excel',
          exportOptions: {
              columns: [ 0, 1, 2, 3, 4 ]
          }
        }
      ],
      'ajax': {
        "beforeSend": function (xhr) {
          xhr.setRequestHeader("Authorization",
          "Bearer " + sessionStorage.getItem('accesstoken'))
        },
        'contentType': 'application/json',
        'url': 'http://localhost:8090/api/iprs/changelog/findall',
        'type': 'POST',
        'data': function(d) {
          console.log("helloll ", JSON.stringify(d));
          return JSON.stringify(d);
        }
      },
      'serverSide' : true,
      columns : [{
        title: 'Narration',
        data: 'narration',
        className: "text-center"
      },{
        title: 'Update By',
        data: 'insertedBy',
        className: "text-center"
      },{
        title: 'Date  Modified',
        data: 'dateModified',
        className: "text-center"
      },
      {
        title: 'Date Created',
        data: 'dateCreated',
        className: "text-center"
      }]
    });
  }
  initUserLogsDatatables(data) {
    console.log("qwqwee");
    this.dtOptionsUserLogs = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
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
          title: 'Logout Time',
          data: 'emailaddress',
          className: "text-center"
        },
        {
          title: 'Login Ip',
          data: 'emailaddress',
          className: "text-center"
        }
      ]
    };

    $('#dtUserLogs').DataTable(this.dtOptionsUserLogs);
  }

  initChangeLogsDatatables(data) {
    console.log("qwqwee");
    this.dtOptionsChangeLogs = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
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
        }
      ]
    };

    $('#dtChangeLogs').DataTable(this.dtOptionsChangeLogs);
  }

  selectedTab(e: MatTabChangeEvent) {
    console.log(e.index);
    let index = e.index;
    if (index == 0) {
      this.getUserLogs();
    } else if (index == 1) {
      this.getChangeLogs();
    }
  }
}
