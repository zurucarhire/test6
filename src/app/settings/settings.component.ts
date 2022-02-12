import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpiryCheckModalComponent } from '../modal/expiry-check-modal/expiry-check-modal.component';
import { User } from '../model/user';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { Clients } from '../model/clients';
import { RequestType } from '../model/requestType';
import { ExpiryPeriod } from '../model/expiryPeriod';
import { ClientModalComponent } from '../modal/client-modal/client-modal.component';
import { RequestTypeModalComponent } from '../modal/request-type-modal/request-type-modal.component';
declare var $;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public tabIndex = 0;
  exipiryCheckDatatable;

  loading = false;
  userId: number;
  roleId: number;

  expiryPeriodButton =  false;

  clientsDatatable;
  requestTypeDatatable;
  expiryPeriodDatatable;

  clientsData: any;
  requestTypeData: any;
  expiryPeriodData: any;

  constructor(private notifyService: NotificationService,
    private api: ApiService, private modalService: NgbModal) { }

  ngOnInit(): void {
    let user = JSON.parse(sessionStorage.getItem('user'));
    this.userId = user["user"]["userID"];
    this.roleId = user["user"]["roleID"];

    this.initClientsDatatables([]);

    this.getClients();
  }

  ngAfterViewInit(): void {
    if (this.tabIndex == 0) {
      this.initClientsDatatables([]);
    } else if (this.tabIndex == 1) {
      // this.initRolesDatatables([]);
    } else if (this.tabIndex == 2) {
      //this.initUserRolesDatatables([]);
    }
  }

  getClients() {
    this.api.findAllClients().subscribe(
      (data: Clients[]) => {

        this.clientsDatatable.clear().rows.add(data).draw();
      }, error => {
        console.log(error);
      });
  }

  getRequestTypes() {
    this.api.findAllRequestTypes().subscribe(
      (data: RequestType[]) => {
        data.forEach(x => {
          let parseDateCreated = new Date(x.dateCreated).toISOString().slice(0, 10);
          let parseDateModified = new Date(x.dateCreated).toISOString().slice(0, 10);
          x.dateCreated = parseDateCreated
          x.dateModified = parseDateModified
        });
        this.requestTypeDatatable.clear().rows.add(data).draw();
      }, error => {
        console.log(error);
      });
  }

  getExpiryPeriod() {
    this.api.findExpiry().subscribe(
      (data: ExpiryPeriod[]) => {
        if (data.length == 0){
          this.expiryPeriodButton = true;
        }
        this.expiryPeriodDatatable.clear().rows.add(data).draw();
      }, error => {
        console.log(error);
      });
  }

  openModal(view, data) {
    const modalRef = this.modalService.open(view, { centered: true });
    modalRef.componentInstance.modalData = data;
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
        console.log(view == ClientModalComponent)
        if (view == ClientModalComponent) {
          if (result['tag'] == 'create') {
            this.saveClient(result);
          } else if (result['tag'] == 'edit') {
            this.updateClient(result);
          } else if (result['tag'] == 'delete') {
            this.deleteClient(result);
          }
        } else if (view == RequestTypeModalComponent) {
          if (result['tag'] == 'create') {
            this.saveRequestType(result);
          } else if (result['tag'] == 'edit') {
            this.updateRequestType(result);
          } else if (result['tag'] == 'delete') {
            this.deleteRequestType(result);
          }
        } else if (view == ExpiryCheckModalComponent) {
          if (result['tag'] == 'create') {
            this.saveExpiryPeriod(result);
          } else if (result['tag'] == 'edit') {
            this.editExpiryPeriod(result);
          }
        }
      }
    });
  }

  saveExpiryPeriod(data) {
    let id = data.expiryID;
    let expiryPeriod = {expiryPeriod: data.expiryPeriod, createdBy: this.userId,
      updatedBy: this.userId};

    this.api.saveExpiryPeriod(this.userId, expiryPeriod).subscribe(
      data => {
        this.expiryPeriodButton = false;
        this.notifyService.showSuccess("Successfully created expiry period", "Success");
        this.expiryPeriodDatatable.row.add(data).draw(false);
      }, error => {
        console.log(error);
        this.notifyService.showError("Something went wrong, please try again", "Oops");
      });
  }

  editExpiryPeriod(data) {
    let id = data.expiryID;
    let period = data.expiryPeriod;

    this.api.updateExpiryPeriod(id, period).subscribe(
      data => {
        console.log("ssd----88 >", data)
        this.modalService.dismissAll();
        this.notifyService.showSuccess("Successfully updated expiry period", "Success");
        this.expiryPeriodDatatable.row(data['rowIndex']).data(data).invalidate();
      }, error => {
        console.log(error);
        this.notifyService.showError("Something went wrong, please try again", "Oops");
      });
  }

  getExpiry() {
    this.api.findExpiry().subscribe(
      data => {
        this.exipiryCheckDatatable.clear().rows.add(data).draw();
      }, error => {
        console.log(error);
      });
  }

  createUser() {

  }

  createClient() {
    let data = { clientName: "", clientDescription: "", active: "", tag: "create" }
    this.openModal(ClientModalComponent, data);
  }
  createExpiryPeriod() {
    let data = { expiryPeriod: "", tag: "create" }
    this.openModal(ExpiryCheckModalComponent, data);
  }

  createRequestType() {
    let data = { requestTypeName: "", active: "", tag: "create" }
    this.openModal(RequestTypeModalComponent, data);
  }

  saveClient(result) {
    let client = {
      clientName: result['clientName'], clientDescription: result['clientDescription'],
      active: result['active'], createdBy: this.userId, updatedBy: this.userId
    }

    this.api.saveClient(this.userId, client).subscribe(
      data => {
        this.loading = false;
        this.clientsDatatable.row.add(data).draw(false);
        this.notifyService.showSuccess("Client saved successfully", "Success");
      },
      error => {
        this.loading = false;
        console.log("error => ", error);
        if (error.error != null) {
          this.notifyService.showError(error.error.message, "Warning");
        } else {
          this.notifyService.showError("Something went wrong, please try again", "Oops");
        }
      }
    );
  }

  updateClient(client) {
    this.api.updateClient(client['clientID'], this.userId, client).subscribe(
      data => {
        this.loading = false;
        this.clientsDatatable.row(client['rowIndex']).data(data).invalidate();
        this.notifyService.showSuccess("Client updated successfully", "Success");
      },
      error => {
        this.loading = false;
        console.log("error => ", error);
        if (error.error != null) {
          this.notifyService.showError(error.error.message, "Warning");
        } else {
          this.notifyService.showError("Something went wrong, please try again", "Oops");
        }
      }
    );
  }

  deleteClient(client) {
    this.api.deleteClient(client['clientID'], this.userId).subscribe(
      data => {
        this.loading = false;
        console.log("data 10r => ", data);


       // this.clientsDatatable.row(client['rowIndex']).data(data).invalidate();
        this.clientsDatatable.row(client['rowIndex']).remove().draw(false);
        this.notifyService.showSuccess("Client deleted successfully", "Success");
      },
      error => {
        this.loading = false;
        console.log("error => ", error);
        if (error.error != null) {
          this.notifyService.showError(error.error.message, "Warning");
        } else {
          this.notifyService.showError("Something went wrong, please try again", "Oops");
        }
      }
    );
  }

  saveRequestType(result) {
    let requestType = {
      requestTypeName: result['requestTypeName'], active: result['active'],
      createdBy: this.userId, updatedBy: this.userId
    }

    this.api.saveRequestType(this.userId, requestType).subscribe(
      data => {
        this.loading = false;
        this.requestTypeDatatable.row.add(data).draw(false);
        this.notifyService.showSuccess("Request Type saved successfully", "Success");
      },
      error => {
        this.loading = false;
        console.log("error => ", error);
        if (error.error != null) {
          this.notifyService.showError(error.error.message, "Warning");
        } else {
          this.notifyService.showError("Something went wrong, please try again", "Oops");
        }
      }
    );
  }

  updateRequestType(requestType) {
    this.api.updateRequestType(requestType['requestTypeID'], this.userId, requestType).subscribe(
      data => {
        this.loading = false;
        this.requestTypeDatatable.row(requestType['rowIndex']).data(data).invalidate();
        this.notifyService.showSuccess("Request Type updated successfully", "Success");
      },
      error => {
        this.loading = false;
        console.log("error => ", error);
        if (error.error != null) {
          this.notifyService.showError(error.error.message, "Warning");
        } else {
          this.notifyService.showError("Something went wrong, please try again", "Oops");
        }
      }
    );
  }

  deleteRequestType(requestType) {
    this.api.deleteRequestType(requestType['requestTypeID'], this.userId).subscribe(
      data => {
        this.loading = false;
        this.requestTypeDatatable.row(requestType['rowToDelete']).remove().draw();
        //this.requestTypeDatatable.row(requestType['rowIndex']+1).remove().draw(true);
        this.notifyService.showSuccess("Request Type deleted successfully", "Success");
      },
      error => {
        this.loading = false;
        console.log("error => ", error);
        if (error.error != null) {
          this.notifyService.showError(error.error.message, "Warning");
        } else {
          this.notifyService.showError("Something went wrong, please try again", "Oops");
        }
      }
    );
  }

  selectedTab(e: MatTabChangeEvent) {
    console.log(e.index);
    let index = e.index;
    if (index == 0) {
      if (this.clientsDatatable == null || this.clientsDatatable == undefined) {
        this.initClientsDatatables([]);
      }
      this.getClients();
    } else if (index == 1) {
      if (this.requestTypeDatatable == null || this.requestTypeDatatable == undefined) {
        this.initRequestTypeDatatables([]);
      }
      this.getRequestTypes();
    } else if (index == 2) {
      if (this.expiryPeriodDatatable == null || this.expiryPeriodDatatable == undefined) {
        this.initExpiryCheckDatatables([]);
      }
      this.getExpiryPeriod();
    }
  }

  initClientsDatatables(data) {
    let scope = this;
    let dtOptions = {
      data: data,
      responsive: true,
      dom: 'Blfrtip',
      buttons: [
        {
          extend: 'excel',
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5]
          }
        }
      ],
      columns: [
        {
          title: 'Client Name',
          data: 'clientName',
          className: "text-center"
        },
        {
          title: 'Description',
          data: 'clientDescription',
          className: "text-center"
        },
        {
          title: 'Active',
          data: 'active',
          className: "text-center"
        },
        {
          title: 'Created By',
          data: 'createdBy',
          className: "text-center"
        },
        {
          title: 'Updated By',
          data: 'updatedBy',
          className: "text-center"
        },
        {
          title: 'Date Created',
          data: 'dateCreated',
          className: "text-center"
        },
        {
          title: 'Date Modified',
          data: 'dateModified',
          className: "text-center"
        },
        {
          title: '',
          data: null,
          className: 'edit',
          defaultContent: '<i style="color: blue ; cursor: pointer" class="fa fa-pencil"></>',
          responsivePriority: 1
        }
        // , {
        //   title: '',
        //   data: null,
        //   className: 'delete',
        //   defaultContent: '<i style="color: brown; cursor: pointer" class="fa fa-trash"></>',
        //   responsivePriority: 1
        // }

      ]
    };

    this.clientsDatatable = $('#clientDT').DataTable(dtOptions);

    $('#clientDT tbody').on('click', 'td.edit', function () {
      console.log("hello2");
      let tr = $(this).closest('tr');
      var rowIndex = tr.index();
      let row = scope.clientsDatatable.row(tr);
      let data = row.data();


      console.log("the rolexxxx", scope.roleId);
      if (scope.roleId == 3 || scope.roleId == 4) {
        scope.notifyService.showError("You do not have permissions to perform this action", "Permission Denied");
        return
      }

      // data['clients'] = scope.clientdata;
      data['tag'] = 'edit';
      data['rowIndex'] = rowIndex;

      scope.openModal(ClientModalComponent, data);
    });

    $('#clientDT tbody').on('click', 'td.delete', function () {
      console.log("hello2");
      let tr = $(this).closest('tr');
      var rowIndex = tr.index();
      let row = scope.clientsDatatable.row(tr);
      let data = row.data();

      if (scope.roleId == 2 || scope.roleId == 3 || scope.roleId == 4) {
        scope.notifyService.showError("You do not have permissions to perform this action", "Permission Denied");
        return
      }

      data['tag'] = 'delete';
      data['rowIndex'] = rowIndex;

      scope.openModal(ClientModalComponent, data);
    });
  }

  initRequestTypeDatatables(data) {
    let scope = this;
    let dtOptions = {
      data: data,
      responsive: true,
      dom: 'Blfrtip',
      buttons: [
        {
          extend: 'excel',
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5]
          }
        }
      ],
      columns: [
        {
          title: 'Request Type Name',
          data: 'requestTypeName',
          className: "text-center"
        },
        {
          title: 'Active',
          data: 'active',
          className: "text-center"
        },
        {
          title: 'Created By',
          data: 'createdBy',
          className: "text-center"
        },
        {
          title: 'Updated By',
          data: 'updatedBy',
          className: "text-center"
        },
        {
          title: 'Date Created',
          data: 'dateCreated',
          className: "text-center"
        },
        {
          title: 'Date Modified',
          data: 'dateModified',
          className: "text-center"
        },
        {
          title: '',
          data: null,
          className: 'edit',
          defaultContent: '<i style="color: blue ; cursor: pointer" class="fa fa-pencil"></>',
          responsivePriority: 1
        }
        , {
          title: '',
          data: null,
          className: 'delete',
          defaultContent: '<i style="color: brown; cursor: pointer" class="fa fa-trash"></>',
          responsivePriority: 1
        }

      ]
    };

    this.requestTypeDatatable = $('#requestTypeDT').DataTable(dtOptions);

    $('#requestTypeDT tbody').on('click', 'td.edit', function () {
      console.log("hello2pp " + $(this).parents('tr'));
      let tr = $(this).closest('tr');
      var rowIndex = tr.index();
      let row = scope.requestTypeDatatable.row(tr);
      let data = row.data();


      console.log("the rolexxxxgg", scope.roleId);
      if (scope.roleId == 3 || scope.roleId == 4) {
        scope.notifyService.showError("You do not have permissions to perform this action", "Permission Denied");
        return
      }

      // data['clients'] = scope.clientdata;
      data['tag'] = 'edit';
      data['rowIndex'] = rowIndex;


      scope.openModal(RequestTypeModalComponent, data);
    });

    $('#requestTypeDT tbody').on('click', 'td.delete', function () {
      console.log("hello2");
      let tr = $(this).closest('tr');
      var rowIndex = tr.index();
      let row = scope.requestTypeDatatable.row(tr);
      let data = row.data();

      if (scope.roleId == 2 || scope.roleId == 3 || scope.roleId == 4) {
        scope.notifyService.showError("You do not have permissions to perform this action", "Permission Denied");
        return
      }

      data['tag'] = 'delete';
      data['rowIndex'] = rowIndex;
      data['rowToDelete'] = $(this).parents('tr');
      scope.openModal(RequestTypeModalComponent, data);
    });
  }

  initExpiryCheckDatatables(data) {
    let scope = this;
    let dtOptions = {
      data: data,
      responsive: true,
      dom: 'frt',
      // dom:'Blfrtip',
      // buttons: [
      //   {
      //     extend: 'excel',
      //     exportOptions: {
      //         columns: [ 0, 1, 2, 3, 4, 5 ]
      //     }
      //   }
      // ],
      columns: [
        {
          title: 'Expiry Period',
          data: 'expiryPeriod',
          className: "text-center"
        },
        {
          title: 'Active',
          data: 'active',
          className: "text-center"
        },
        {
          title: 'Created By',
          data: 'createdBy',
          className: "text-center"
        },
        {
          title: 'Updated By',
          data: 'updatedBy',
          className: "text-center"
        },
        {
          title: 'Date Created',
          data: 'dateCreated',
          className: "text-center"
        },
        {
          title: 'Date Modified',
          data: 'dateModified',
          className: "text-center"
        },
        {
          title: '',
          data: null,
          className: 'edit',
          defaultContent: '<i style="color: blue ; cursor: pointer" class="fa fa-pencil"></>',
          responsivePriority: 1
        }
      ]
    };

    this.expiryPeriodDatatable = $('#expiryPeriodDT').DataTable(dtOptions);

    $('#expiryPeriodDT tbody').on('click', 'td.edit', function () {
      console.log("hello2");
      let tr = $(this).closest('tr');
      var rowIndex = tr.index();
      let row = scope.expiryPeriodDatatable.row(tr);
      let data = row.data();

      if (scope.roleId == 3 || scope.roleId == 4) {
        scope.notifyService.showError("You do not have permissions to perform this action", "Permission Denied");
        return
      }

      // data['clients'] = scope.clientdata;
      data['tag'] = 'edit';
      data['rowIndex'] = rowIndex;

      scope.openModal(ExpiryCheckModalComponent, data);
    });
  }

}
