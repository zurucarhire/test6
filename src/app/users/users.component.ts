import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { User } from '../model/user';
import { ApiService } from '../service/api.service';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestType } from '../model/requestType';
import { forkJoin } from 'rxjs';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../service/notification.service';
import { ActivatedRoute } from '@angular/router';
import { Role } from '../model/role';
import { UserModalComponent } from '../modal/user-modal/user-modal.component';
import { UserRoleModalComponent } from '../modal/user-role-modal/user-role-modal.component';
import { RoleModalComponent } from '../modal/role-modal/role-modal.component';
declare var $;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  userData: User;
  emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  public tabIndex = 0;
  mattabindex = 1;
  loading = false;
  usersDatatable;
  rolesDatatable;
  userRolesDatatable;
  dt3;
  dtPermission;
  dtModuleAction;
  dataTable: any;
  dtOptions: any;
  dataTable2: any;
  dtOptions2: any;
  dtOptions3: any;
  dtOptionsPermission: any;
  dtOptionsModuleAction: any;
  data = [];
  closeResult: string;

  clientdata: any;
  roleData: any;
  requesttypedata: any;

  useridvalue: number;
  roleidvalue: number;
  clientidvalue: number;
  clientnamevalue: string;
  fullnamevalue: string;
  emailaddressvalue: string;
  idnumbervalue: string;
  msisdnvalue: string;

  public user = {
    name: 'Izzat Nadiri',
    age: 26
  }

  public modalData = {
    name: 'Izzat Nadiri',
    age: 26
  }

  rolesData: Role[];
  roleId;
  userId;
  constructor(private api: ApiService, private modalService: NgbModal,
    private notifyService: NotificationService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    let user = JSON.parse(sessionStorage.getItem('user'));
    this.roleId = user["user"]["roleID"];
    this.userId = user["user"]["userID"];
    this.activatedRoute.queryParams.subscribe(
      params => {
        console.log("ggg", params);
        let value = params['value'];
        if (value == 'users') {
          this.tabIndex = 0
          this.fetchUsers();
        } else if (value == 'roles') {
          this.tabIndex = 1
          this.getRoles('datatables');
        } else if (value == 'user roles') {
          this.tabIndex = 2
          if (this.rolesData == undefined) {
            this.getRoles('roles')
          }
          this.getUserRoles();
        } else {
          this.tabIndex = 0
          this.fetchUsers();
        }
      }
    )

  }

  ngAfterViewInit(): void {
    if (this.tabIndex == 0) {
      this.initUsersDatatables([]);
    } else if (this.tabIndex == 1) {
      this.initRolesDatatables([]);
    } else if (this.tabIndex == 2) {
      this.initUserRolesDatatables([]);
    }
  }

  fetchUsers() {
    this.api.findAllUsers().subscribe(
      (data: User[]) => {
        this.usersDatatable.clear().rows.add(data).draw();
        this.fetchAsync();
      }, error => {
        console.log(error);
      });
  }

  getRoles(param) {
    this.api.findAllRoles().subscribe(
      (data: Role[]) => {
        console.log("0000d" + data);
        if (param == 'datatables') {
          this.rolesDatatable.clear().rows.add(data).draw();
        }
        this.rolesData = data;

        //this.fetchAsync();
      }, error => {
        console.log(error);
      });
  }

  getUserRoles() {
    this.api.findAllUserRoles().subscribe(
      data => {
        console.log("0000d-" + data);
        this.userRolesDatatable.clear().rows.add(data).draw();
        this.fetchAsync();
      }, error => {
        console.log(error);
      });
  }

  fetchGroups() {
    this.api.findAllUsers().subscribe(
      (data: User[]) => {
        this.data = data;
        //this.initGroupsDatatables(data);
        this.fetchAsync();
      }, error => {
        console.log(error);
      });
  }

  fetchAsync() {
    let clients = this.api.findAllClients();
    let roles = this.api.findAllActiveRoles();
    let requestTypes = this.api.findAllRequestTypes();
    forkJoin([clients, roles, requestTypes]).subscribe(results => {
      this.clientdata = results[0];
      this.roleData = results[1];
      this.requesttypedata = results[2];
    });
    ///this.fundChart(data);
  }

  openModal(view, data) {
    const modalRef = this.modalService.open(view, { centered: true });
    modalRef.componentInstance.modalData = data;
    modalRef.result.then((result) => {
      if (result) {
        console.log(">>> "+result);
        if (result['tag'] == 'createUser') {
          this.saveUser(result);
        } else if (result['tag'] == 'editUser') {
          this.editUser(result);
        } else if (result['tag'] == 'deleteUser') {
          this.deleteUser(result);
        } else if (result['tag'] == 'resetUserPassword') {
          this.resetPassword(result);
        } else if (result['tag'] == 'createRole') {
          this.saveRole(result);
        } else if (result['tag'] == 'editRole') {
          this.editRole(result);
        } else if (result['tag'] == 'deleteRole') {
          console.log("tyyy")
          this.deleteRole(result);
        } else if (result['tag'] == 'editUserRoles') {
          this.editUserRole(result['userID'], result['roleName'], result['rowIndex']);
        } else if (result['tag'] == 'deleteUserRoles') {
          this.deleteUserRole(result['userID'], result['rowIndex']);
        }
      }
    });
  }

  selectedTab(e: MatTabChangeEvent) {
    console.log(e.index);
    let index = e.index;
    if (index == 0) {
      if (this.usersDatatable == null || this.usersDatatable == undefined) {
        this.initUsersDatatables([]);
      }
      this.fetchUsers();
    } else if (index == 1) {
      if (this.rolesDatatable == null || this.rolesDatatable == undefined) {
        this.initRolesDatatables([]);
      }
      this.getRoles('datatables');
    } else if (index == 2) {
      if (this.userRolesDatatable == null || this.userRolesDatatable == undefined) {
        this.initUserRolesDatatables([]);
      }

      if (this.rolesData == undefined) {
        this.getRoles('roles')
      }
      this.getUserRoles();
    }
  }

  initUsersDatatables(data) {
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
          data: null,
          className: 'details-control',
          defaultContent: '',
          responsivePriority: 1
        },
        {
          title: 'Client',
          data: 'client.clientName',
          className: "text-center"
        },
        {
          title: 'Username',
          data: 'userName',
          className: "text-center"
        },
        {
          title: 'Full Name',
          data: 'fullName',
          className: "text-center"
        },
        {
          title: 'ID Number',
          data: 'idNumber',
          className: "text-center"
        },
        {
          title: 'Email',
          data: 'emailAddress',
          className: "text-center"
        },
        {
          title: 'Phone',
          data: 'msisdn',
          className: "text-center"
        },
        {
          title: 'Active',
          data: 'active',
          className: "text-center"
        }, {
          title: '',
          data: null,
          className: 'resetpassword',
          defaultContent: '<i style="color: green; cursor: pointer" class="fa fa-lock"></>',
          responsivePriority: 1
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

    this.usersDatatable = $('#dt').DataTable(dtOptions);

    $('#dt tbody').on('click', 'td.resetpassword', function () {
      console.log("hello");
      let tr = $(this).closest('tr');
      let row = scope.usersDatatable.row(tr);

      let user = JSON.parse(sessionStorage.getItem('user'));
      let role = user["user"]["roleID"];
      console.log("the rolexxxx", role);
      if (role == 2) {
        scope.notifyService.showError("You do not have permissions to perform this action", "Permission Denied");
        return
      }

      let data = row.data();
      data['tag'] = 'resetUserPassword';
      scope.openModal(UserModalComponent, data);
    });

    $('#dt tbody').on('click', 'td.edit', function () {
      console.log("hello2");
      let tr = $(this).closest('tr');
      var rowIndex = tr.index();
      let row = scope.usersDatatable.row(tr);
      let data = row.data();

      if (scope.roleId == 3 || scope.roleId == 4) {
        scope.notifyService.showError("You do not have permissions to perform this action", "Permission Denied");
        return
      }


      data['clients'] = scope.clientdata;
      data['roles'] = scope.roleData;
      data['tag'] = 'editUser';
      data['rowIndex'] = rowIndex;
      scope.openModal(UserModalComponent, data);
    });

    $('#dt tbody').on('click', 'td.delete', function () {
      console.log("hello3");
      let tr = $(this).closest('tr');
      var rowIndex = tr.index();
      let row = scope.usersDatatable.row(tr);

      if (scope.roleId == 2 || scope.roleId == 3 || scope.roleId == 4) {
        scope.notifyService.showError("You do not have permissions to perform this action", "Permission Denied");
        return
      }

      let data = row.data();
      scope.userData = data;
      scope.useridvalue = data.userID;
      console.log(data);
      data['clients'] = scope.clientdata;
      data['tag'] = 'deleteUser';
      data['rowIndex'] = rowIndex;
      data['rowToDelete'] = $(this).parents('tr');

      scope.openModal(UserModalComponent, data);
    });

    $('#dt tbody').on('click', 'td.details-control', function () {
      var tr = $(this).closest('tr');
      var row = scope.usersDatatable.row(tr);

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
      console.log("pi>>> ", d);

      let dRow = '';
      dRow = dRow + '<tbody><tr>' +
        '<td>' + d.canAccessUi + '</td>' +
        '<td>' + d.createdBy + '</td>' +
        '<td>' + d.updatedBy + '</td>' +
        '<td class="align-center">' + d.lastLoginDate + '</td>' +
        '<td>' + d.dateCreated + '</td>' +
        '<td>' + d.dateModified + '</td>' +
        '</tr></tbody>';

      return '<table class="table "><thead class="thead-dark"><tr><th scope="col">UI Access</th><th scope="col">Created By</th><th scope="col">Updated By</th><th scope="col">Last Login Date</th><th scope="col">Date Created</th><th scope="col">Date Modified</th></tr></thead>' + dRow + '</table>';
    }
  }

  initRolesDatatables(data) {
    let scope = this;
    let dtOptions = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
      dom: 'Blfrtip',
      buttons: [
        {
          extend: 'excel',
          exportOptions: {
            columns: [0, 1, 2, 3, 4]
          }
        }
      ],

      columns: [
        {
          title: 'Role Name',
          data: 'roleAlias',
          className: "text-center"
        },
        {
          title: 'Description',
          data: 'description',
          className: "text-center"
        },
        {
          title: 'Active',
          data: 'active',
          className: "text-center"
        },
        {
          title: 'Inserted By',
          data: 'insertedBy',
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
        //   defaultContent: '<i style="color: brown; cursor: pointer; text-align: center" class="fa fa-trash"></>',
        //   responsivePriority: 1
        // }

      ]
    };

    this.rolesDatatable = $('#dt2').DataTable(dtOptions);

    $('#dt2 tbody').on('click', 'td.edit', function () {
      let tr = $(this).closest('tr');
      let row = scope.rolesDatatable.row(tr);
      var rowIndex = tr.index();

      if (scope.roleId == 3 || scope.roleId == 4) {
        scope.notifyService.showError("You do not have permissions to perform this action", "Permission Denied");
        return
      }
      let data = row.data();
      scope.roleidvalue = data.roleID;
      console.log(data);

      data['tag'] = 'editRole';
      data['rowIndex'] = rowIndex;
      data['rowToEdit'] = $(this).parents('tr');
      scope.openModal(RoleModalComponent, data);
      //scope.openModal(scope.editRoleModal,'lg');
    });

    $('#dt2 tbody').on('click', 'td.delete', function () {
      let tr = $(this).closest('tr');
      let row = scope.rolesDatatable.row(tr);
      var rowIndex = tr.index();

      if (scope.roleId == 2 || scope.roleId == 3 || scope.roleId == 4) {
        scope.notifyService.showError("You do not have permissions to perform this action", "Permission Denied");
        return
      }
      let data = row.data();
      console.log(data)
      scope.roleidvalue = data.roleID;
      data['tag'] = 'deleteRole';
      data['rowIndex'] = rowIndex;
      scope.openModal(RoleModalComponent, data);
      //scope.openModal(scope.deleteRoleModal,'sm');
    });
  }

  initUserRolesDatatables(data) {
    let scope = this;
    let dtOptions = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
      dom: 'Blfrtip',
      buttons: [
        {
          extend: 'excel',
          exportOptions: {
            columns: [0, 1, 2, 3, 4]
          }
        }
      ],

      columns: [
        {
          title: 'User Name',
          data: 'userName',
          className: "text-center"
        },
        {
          title: 'Role Name',
          data: 'roleAlias',
          className: "text-center"
        },
        {
          title: 'Permissions',
          data: 'permissions',
          className: "text-center"
        },
        {
          title: 'Active',
          data: 'active',
          className: "text-center"
        },
        // {
        //   title: '',
        //   data: null,
        //   className: 'edit',
        //   defaultContent: '<i style="color: blue ; cursor: pointer" class="fa fa-pencil"></>',
        //   responsivePriority: 1
        // }
        // , {
        //   title: '',
        //   data: null,
        //   className: 'delete',
        //   defaultContent: '<i style="color: brown; cursor: pointer" class="fa fa-trash"></>',
        //   responsivePriority: 1
        // }

      ]
    };

    this.userRolesDatatable = $('#dtUserRoles').DataTable(dtOptions);

    $('#dtUserRoles tbody').on('click', 'td.edit', function () {
      let tr = $(this).closest('tr');
      var rowIndex = tr.index();
      console.log("eoo- ", rowIndex)
      let row = scope.userRolesDatatable.row(tr);
      let data = row.data();
      data['roles'] = scope.rolesData;
      data['tag'] = 'editUserRoles';
      data['rowIndex'] = rowIndex;
      scope.useridvalue = data.userID;
      console.log(data);
      scope.openModal(UserRoleModalComponent, data);
    });

    $('#dtUserRoles tbody').on('click', 'td.delete', function () {
      let tr = $(this).closest('tr');
      var rowIndex = tr.index();
      let row = scope.userRolesDatatable.row(tr);
      let data = row.data();
      data['roles'] = scope.rolesData;
      data['tag'] = 'deleteUserRoles';
      data['rowIndex'] = rowIndex;
      scope.useridvalue = data.userID;
      console.log(data);
      scope.openModal(UserRoleModalComponent, data);
    });
  }


  editUser(user) {
    console.log("ssd-ttk- >", this.userId)
    this.api.updateUser(user['userID'], this.userId, user).subscribe(
      data => {
        this.notifyService.showSuccess("Update successful", "Success");
        this.usersDatatable.row(user['rowIndex']).data(data).invalidate().draw();
      }, error => {
        if (error.error != null){
          if (error.status == 400){
            this.notifyService.showError("Please enter all fields", "Warning");
            return
          }
          this.notifyService.showError(error.error.message, "Warning");
        } else {
          this.notifyService.showError("Something went wrong, please try again", "Oops");
        }
      });
  }

  submitEditRole(form: NgForm) {
    let roleid = form.value.deleteroleid;
    let description = form.value.description;

    if (roleid == "" && description == "") {
      this.notifyService.showError("Please edit role", "Validation")
      return;
    }

    this.api.updateRole(roleid, description).subscribe(
      data => {
        console.log("ssd----88 >", data)
        this.notifyService.showSuccess("Update successful", "Success");
        //this.rolesDatatable.clear().rows.add(data).draw();
        this.rolesDatatable.row(1).data(data).invalidate();
        //this.getRoles('datatables');
        this.modalService.dismissAll();
      }, error => {
        console.log(error);
        this.notifyService.showError("Something went wrong, please try again", "Oops");
        this.modalService.dismissAll();
      });
  }

  editRole(role) {
    console.log("pekelert", role)
    let roleid = role.roleID;

    this.api.updateRole(roleid, role).subscribe(
      data => {
        console.log("ssd----88 ------LL>", data)
        this.notifyService.showSuccess("Update successful", "Success");
        this.rolesDatatable.row(role['rowToEdit']).data(data).invalidate().draw();
      }, error => {
        console.log(error);
        this.notifyService.showError("Something went wrong, please try again", "Oops");
      });
  }

  submitResetPassword(form: NgForm) {
    console.log(form.value)
  }

  deleteUser(user) {
    console.log("rttt", user);
    this.api.deleteUser(user['userID'], this.userId).subscribe(
      data => {
        console.log("ssd---- >", data)
        this.notifyService.showSuccess("Delete successful", "Success");

        this.usersDatatable.row(user['rowToDelete']).remove().draw();
        //this.fetchUsers();
      }, error => {
        if (error.error != null){
          if (error.status == 400){
            this.notifyService.showError("Please enter all fields", "Warning");
            return
          }
          this.notifyService.showError(error.error.message, "Warning");
        } else {
          this.notifyService.showError("Something went wrong, please try again", "Oops");
        }
      });
  }

  resetPassword(user) {
    this.api.resetPassword(user['userID'], this.userId).subscribe(
      data => {
        this.notifyService.showSuccess("The generated password for " + data["username"] + " is " + data["password"], "Reset Password successful");
      }, error => {
        if (error.error != null){
          if (error.status == 400){
            this.notifyService.showError("Please enter all fields", "Warning");
            return
          }
          this.notifyService.showError(error.error.message, "Warning");
        } else {
          this.notifyService.showError("Something went wrong, please try again", "Oops");
        }
      });
  }

  createUser() {
    let data = {
      clients: this.clientdata, userName: "", fullName: "", emailAddress: "",
      idNumber: "", msisdn: "", tag: "createUser", roles: this.roleData}
    this.openModal(UserModalComponent, data);
  }

  saveUser(user) {
    console.log("PPP>> ", user);
    console.log("PPP>> ", user['IDNumber']);
    this.api.saveUser(this.userId, user).subscribe(
      data => {
        this.loading = false;
        var client = "";
        this.clientdata.forEach(element => {
          if (element['clientID'] == user['clientID']) {
            console.log(element);
            client = element;
          }
        });
        data['client'] = client;
        this.usersDatatable.row.add(data).draw(false);
        this.notifyService.showSuccess("User saved successfully", "Success");
      },
      error => {
        this.loading = false;
        console.log("error => ", error);
        if (error.error != null){
          if (error.status == 400){
            this.notifyService.showError("Please enter all fields", "Warning");
            return
          }
          this.notifyService.showError(error.error.message, "Warning");
        } else {
          this.notifyService.showError("Something went wrong, please try again", "Oops");
        }
      }
    );
  }

  createRole() {
    //this.openModal(this.createRoleModal,'lg');
    let data = { tag: "createRole", rowIndex: -1, }
    this.openModal(RoleModalComponent, data);
  }

  saveRole(user) {
    let roleName: string = user.roleName;
    let description: string = user.description;
    console.log("rty", roleName)
    if (roleName == '' || description == "") {
      console.log("hello world");
      this.notifyService.showError("Please enter all fields", "Warning");
      return;
    }

    let role = { roleName: roleName.toString().toUpperCase(), roledescription: description, insertedBy: 1, updatedBy: 1, active: 1 }

    this.api.saveRole(role).subscribe(
      data => {
        this.loading = false;
        console.log("data 101 => ", data);
        this.rolesDatatable.row.add(data).draw(false);
        this.notifyService.showSuccess("Role saved successfully", "Success");
      },
      error => {
        this.loading = false;
        console.log("error => ", error);
        this.notifyService.showError("Something went wrong, please try again", "Something went wrong");
      }
    );
  }

  submitDeleteRole(form: NgForm) {
    console.log("deleterole", form.value);
    let roleid = form.value.deleteroleid;

    this.api.deleteRole(roleid).subscribe(
      (data: User) => {
        console.log("ssd---- >", data)
        this.notifyService.showSuccess("Delete successful", "Success");

        this.getRoles('datatables');
        this.modalService.dismissAll();
      }, error => {
        console.log(error);
        this.notifyService.showError("Something went wrong, please try again", "Oops");
        this.modalService.dismissAll();
      });
  }

  deleteRole(user) {
    console.log("deleterole", user);
    let roleid = user.roleID;

    this.api.deleteRole(roleid).subscribe(
      data => {
        console.log("ssd---- >", data)
        console.log("ssd99-99---- >", user['rowIndex'])
        this.notifyService.showSuccess("Delete successful", "Success");
        this.rolesDatatable.row(user['rowIndex']).data(data).invalidate();
      }, error => {
        console.log(error);
        this.notifyService.showError("Something went wrong, please try again", "Oops");
      });
  }

  submitEditUserRole(form: NgForm) {
    console.log(form.value);
    let userId = form.value.edituserroleuserid;
    let roleId = form.value.edituserroleroleid;
    this.api.editUserRole(userId, roleId).subscribe(
      data => {
        console.log("ssd---- >", data)
        this.notifyService.showSuccess("Update successful", "Success");

        this.getUserRoles();
        this.modalService.dismissAll();
      }, error => {
        console.log(error);
        this.notifyService.showError("Something went wrong, please try again", "Oops");
        this.modalService.dismissAll();
      });
  }

  editUserRole(userId, roleId, rowIndex) {
    this.api.editUserRole(userId, roleId).subscribe(
      data => {
        console.log("ssd---- >", data)
        console.log("rowIndex---- >", rowIndex)
        this.notifyService.showSuccess("Update successful", "Success");

        this.userRolesDatatable.row(rowIndex).data(data).invalidate();
      }, error => {
        console.log(error);
        this.notifyService.showError("Something went wrong, please try again", "Oops");
        this.modalService.dismissAll();
      });
  }

  deleteUserRole(userId, rowIndex) {
    this.api.deleteUserRole(userId).subscribe(
      data => {
        console.log("ssd---- >", data)
        console.log("rowIndex---- >", rowIndex)
        this.notifyService.showSuccess("Delete successful", "Success");

        this.userRolesDatatable.row(rowIndex).data(data).invalidate();
      }, error => {
        console.log(error);
        this.notifyService.showError("Something went wrong, please try again", "Oops");
        this.modalService.dismissAll();
      });
  }

  submitDeleteUserRole(form: NgForm) {
    console.log(form.value);
    let userId = form.value.deleteuserroleuserid;
    this.api.deleteUserRole(userId).subscribe(
      data => {
        console.log("ssd---- >", data)
        this.notifyService.showSuccess("Delete successful", "Success");

        this.getUserRoles();
        this.modalService.dismissAll();
      }, error => {
        console.log(error);
        this.notifyService.showError("Something went wrong, please try again", "Oops");
        this.modalService.dismissAll();
      });
  }
}
