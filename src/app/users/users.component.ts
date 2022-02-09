import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { User } from '../model/user';
import { ApiService } from '../service/api.service';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Client } from '../model/client';
import { Requesttype } from '../model/requesttype';
import { forkJoin } from 'rxjs';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../service/notification.service';
import { ActivatedRoute } from '@angular/router';
import { BindingScope } from '@angular/compiler/src/render3/view/template';
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
  @ViewChild('tabs') tabGroup: MatTabGroup;
  // @ViewChild('dataTable', { static: false }) table: ElementRef;
  @ViewChild("createUserModal") createUserModal: TemplateRef<any>;
  @ViewChild("resetPasswordModal") resetPasswordModal: TemplateRef<any>;
  @ViewChild("editUserModal") editUserModal: TemplateRef<any>;
  @ViewChild("deleteUserModal") deleteUserModal: TemplateRef<any>;

  @ViewChild("createUserGroupModal") createUserGroupModal: TemplateRef<any>;
  @ViewChild("editUserGroupModal") editUserGroupModal: TemplateRef<any>;
  @ViewChild("deleteUserGroupModal") deleteUserGroupModal: TemplateRef<any>;

  @ViewChild("createRoleModal") createRoleModal: TemplateRef<any>;
  @ViewChild("editRoleModal") editRoleModal: TemplateRef<any>;
  @ViewChild("deleteRoleModal") deleteRoleModal: TemplateRef<any>;

  @ViewChild("editUserRoleModal") editUserRoleModal: TemplateRef<any>;
  @ViewChild("deleteUserRoleModal") deleteUserRoleModal: TemplateRef<any>;

  @ViewChild("createPermissionModal") createPermissionModal: TemplateRef<any>;
  @ViewChild("editPermissionModal") editPermissionModal: TemplateRef<any>;
  @ViewChild("deletePermissionModal") deletePermissionModal: TemplateRef<any>;

  @ViewChild("createModuleActionModal") createModuleActionModal: TemplateRef<any>;
  @ViewChild("editModuleActionModal") editModuleActionModal: TemplateRef<any>;
  @ViewChild("deleteModuleActionModal") deleteModuleActionModal: TemplateRef<any>;

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
  constructor(private api: ApiService,private modalService: NgbModal,
    private notifyService: NotificationService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    let user = JSON.parse(sessionStorage.getItem('user'));
    this.roleId = user["user"]["roleID"];
    this.userId = user["user"]["userID"];
    this.activatedRoute.queryParams.subscribe(
      params => {
        console.log("ggg",params);
        let value = params['value'];
        if (value == 'users'){
          this.tabIndex = 0
          this.fetchUsers();
        } else if (value == 'roles'){
          this.tabIndex = 1
          this.getRoles('datatables');
        } else if (value == 'user roles'){
          this.tabIndex = 2
          if (this.rolesData == undefined){
            this.getRoles('roles')
          }
          this.getUserRoles();
        } else if (value == 'permissions'){
          this.tabIndex = 3
          this.getPermissions();
        } else if (value == 'module actions'){
          this.tabIndex = 4
          this.getModuleActions();
        } else {
          this.tabIndex = 0
          this.fetchUsers();
        }
      }
    )

  }

  ngAfterViewInit(): void{
    if (this.tabIndex == 0){
      this.initUsersDatatables([]);
    } else if (this.tabIndex == 1){
      this.initRolesDatatables([]);
    } else if (this.tabIndex == 2){
      this.initUserRolesDatatables([]);
    }
  }

  fetchUsers(){
    this.api.findAllUsers().subscribe(
      (data: User[]) => {
        this.usersDatatable.clear().rows.add(data).draw();
        this.fetchAsync();
    }, error => {
      console.log(error);
    });
  }

  getRoles(param){
    this.api.findAllRoles().subscribe(
      (data: Role[]) => {
        if(param == 'datatables'){
          this.rolesDatatable.clear().rows.add(data).draw();
        }
        this.rolesData = data;

        //this.fetchAsync();
    }, error => {
      console.log(error);
    });
  }

  getUserRoles(){
    this.api.findAllUserRoles().subscribe(
      data => {
        this.userRolesDatatable.clear().rows.add(data).draw();
        this.fetchAsync();
    }, error => {
      console.log(error);
    });
  }

  fetchGroups(){
    this.api.findAllUsers().subscribe(
      (data: User[]) => {
        this.data = data;
        //this.initGroupsDatatables(data);
        this.fetchAsync();
    }, error => {
      console.log(error);
    });
  }

  getPermissions(){
    this.api.findAllUsers().subscribe(
      (data: User[]) => {
        this.data = data;
        this.initPermissionsDatatables(data);
        this.fetchAsync();
    }, error => {
      console.log(error);
    });
  }

  getModuleActions(){
    this.api.findAllUsers().subscribe(
      (data: User[]) => {
        this.data = data;
        this.initModuleActionsDatatables(data);
        this.fetchAsync();
    }, error => {
      console.log(error);
    });
  }


  fetchAsync() {
    let clients = this.api.findAllClients();
    let requestTypes = this.api.findAllRequestTypes();
    forkJoin([clients, requestTypes]).subscribe(results => {
      this.clientdata = results[0];
      this.requesttypedata = results[1];
      console.log("results 1 => ", this.clientdata);
      console.log("results 2 => ", this.requesttypedata);
    });
    ///this.fundChart(data);
  }

  openModal(content, size) {
    this.modalService.open(content, { size: size, ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-holder', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // openModal(content, size) {
  //   const modalRef = this.modalService.open(content, { size: size, ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-holder', centered: true });

  //   let data = {
  //     prop1: 'Some Data',
  //     prop2: 'From Parent Component',
  //     prop3: 'This Can be anything'
  //   }

  //   modalRef.componentInstance.editRoleModal = data;
  //   modalRef.result.then((result) => {
  //     console.log(result);
  //   }, (reason) => {
  //   });
  // }

  openModal2(view, data) {
    const modalRef = this.modalService.open(view, {centered: true });
    modalRef.componentInstance.modalData = data;
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
        if (result['tag'] == 'createUser'){
          this.createUser2(result);
        } else if (result['tag'] == 'deleteUser'){
          this.deleteUser(result);
        } else if (result['tag'] == 'editUser'){
          this.editUser(result);
        } else if (result['tag'] == 'createRole'){
          this.createRole2(result);
        } else if (result['tag'] == 'editRole'){
          this.editRole(result);
        }else if (result['tag'] == 'deleteRole'){
          console.log("tyyy")
          this.deleteRole(result);
        } else if (result['tag'] == 'editUserRoles'){
          this.editUserRole(result['userID'],result['roleName'],result['rowIndex']);
        } else if (result['tag'] == 'deleteUserRoles'){
          this.deleteUserRole(result['userID'],result['rowIndex']);
        }
      }
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

  selectedTab(e: MatTabChangeEvent) {
    console.log(e.index);
    let index = e.index;
    if (index == 0) {
      if (this.usersDatatable == null || this.usersDatatable == undefined ){
        this.initUsersDatatables([]);
      }
      this.fetchUsers();
    } else if (index == 1) {
      if (this.rolesDatatable == null || this.rolesDatatable == undefined ){
        this.initRolesDatatables([]);
      }
      this.getRoles('datatables');
    } else if (index == 2) {
      if (this.userRolesDatatable == null || this.userRolesDatatable == undefined ){
        this.initUserRolesDatatables([]);
      }

      if (this.rolesData == undefined){
        this.getRoles('roles')
      }
      this.getUserRoles();
    } else if (index == 3) {
      this.getPermissions();
    } else if (index == 4) {
      this.getModuleActions();
    }
  }

  initUsersDatatables(data) {
    let scope = this;
    let dtOptions = {
      data: data,
      responsive: true,
      dom:'Blfrtip',
      buttons: [
        {
          extend: 'excel',
          exportOptions: {
              columns: [ 0, 1, 2, 3, 4, 5 ]
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
          title: 'Client Name',
          data: 'client.clientName',
          className: "text-center"
        },
        {
          title: 'Username',
          data: 'userName',
          className: "text-center"
        },
        {
          title: 'Full Names',
          data: 'fullName',
          className: "text-center"
        },
        {
          title: 'Email Address',
          data: 'emailAddress',
          className: "text-center"
        },
        {
          title: 'Phone',
          data: 'msisdn',
          className: "text-center"
        },
        {
          title: 'Access',
          data: 'canAccessUi',
          className: "text-center"
        },
        {
          title: 'Active',
          data: 'active',
          className: "text-center"
        },{
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
        ,{
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
      if (role == 2){
        scope.notifyService.showError("You do not have permissions to perform this action","Permission Denied");
        return
      }

      let data = row.data();
      scope.clientidvalue = data.id;
      scope.openModal(scope.resetPasswordModal,'lg');
    });

    $('#dt tbody').on('click', 'td.edit', function () {
      console.log("hello2");
      let tr = $(this).closest('tr');
      var rowIndex = tr.index();
      let row = scope.usersDatatable.row(tr);
      let data = row.data();

      let user = JSON.parse(sessionStorage.getItem('user'));
      let role = user["user"]["roleID"];
      console.log("the rolexxxx", role);
      if (role == 2){
        scope.notifyService.showError("You do not have permissions to perform this action","Permission Denied");
        return
      }

      console.log("oyaaa ->", data);
      console.log("poleee", data);
      scope.userData = data;
      console.log("poleee33!", this.userData);
      scope.useridvalue = data.userID;
      scope.clientidvalue = data.client.clientID;
      scope.clientnamevalue = data.client.clientName;
      scope.fullnamevalue = data.fullName;
      scope.emailaddressvalue = data.emailAddress;
      scope.idnumbervalue = data.idNumber;
      scope.msisdnvalue = data.msisdn;
      console.log(data);

      data['clients'] = scope.clientdata;
      data['tag'] = 'editUser';
      data['rowIndex'] = rowIndex;
      console.log("the urtt - > ", data);
      scope.openModal2(UserModalComponent,data);
    });

    $('#dt tbody').on('click', 'td.delete', function () {
      console.log("hello3");
      let tr = $(this).closest('tr');
      var rowIndex = tr.index();
      let row = scope.usersDatatable.row(tr);
      let user = JSON.parse(sessionStorage.getItem('user'));
      let role = user["user"]["roleID"];
      if (role == 2){
        scope.notifyService.showError("You do not have permissions to perform this action","Permission Denied");
        return
      }

      let data = row.data();
      scope.userData = data;
      scope.useridvalue = data.userID;
      console.log(data);
      data['clients'] = scope.clientdata;
      data['tag'] = 'deleteUser';
      data['rowIndex'] = rowIndex;

      scope.openModal2(UserModalComponent,data);
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
      console.log("pi>>> ", d.userName);

      let dRow = '';
      dRow = dRow + '<tbody><tr>' +
        '<td>' + d.idNumber + '</td>' +
        '<td>' + d.passwordAttempts + '</td>' +
        '<td>' + d.idnumber + '</td>' +
        '<td>' + d.idnumber + '</td>' +
        '<td>' + d.idnumber + '</td>' +
        '</tr></tbody>';

      return '<table class="table "><thead class="thead-dark"><tr><th scope="col">ID Number</th><th scope="col">Password Attempts</th><th scope="col">Password Status</th><th scope="col">Last Login Date</th><th scope="col">Date Created</th></tr></thead>' + dRow + '</table>';
    }
  }

  initRolesDatatables(data) {
    let scope = this;
    let dtOptions = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
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
          title: 'Role Name',
          data: 'roleName',
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
          title: '',
          data: null,
          className: 'edit',
          defaultContent: '<i style="color: blue ; cursor: pointer" class="fa fa-pencil"></>',
          responsivePriority: 1
        }
        ,{
          title: '',
          data: null,
          className: 'delete',
          defaultContent: '<i style="color: brown; cursor: pointer; text-align: center" class="fa fa-trash"></>',
          responsivePriority: 1
        }

      ]
    };

    this.rolesDatatable = $('#dt2').DataTable(dtOptions);

    $('#dt2 tbody').on('click', 'td.edit', function () {
      let tr = $(this).closest('tr');
      let row = scope.rolesDatatable.row(tr);
      var rowIndex = tr.index();

      if (scope.roleId == 2){
        scope.notifyService.showError("You do not have permissions to perform this action","Permission Denied");
        return
      }
      let data = row.data();
      scope.roleidvalue = data.roleID;
      console.log(data);

      data['tag'] = 'editRole';
      data['rowIndex'] = rowIndex;
     scope.openModal2(RoleModalComponent,data);
      //scope.openModal(scope.editRoleModal,'lg');
    });

    $('#dt2 tbody').on('click', 'td.delete', function () {
      let tr = $(this).closest('tr');
      let row = scope.rolesDatatable.row(tr);
      var rowIndex = tr.index();

      if (scope.roleId == 2){
        scope.notifyService.showError("You do not have permissions to perform this action","Permission Denied");
        return
      }
      let data = row.data();
      console.log(data)
      scope.roleidvalue = data.roleID;
      data['tag'] = 'deleteRole';
      data['rowIndex'] = rowIndex;
     scope.openModal2(RoleModalComponent,data);
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
          title: 'User Name',
          data: 'userName',
          className: "text-center"
        },
        {
          title: 'Role Name',
          data: 'roleName',
          className: "text-center"
        },
        {
          title: 'Active',
          data: 'active',
          className: "text-center"
        },
        {
          title: '',
          data: null,
          className: 'edit',
          defaultContent: '<i style="color: blue ; cursor: pointer" class="fa fa-pencil"></>',
          responsivePriority: 1
        }
        ,{
          title: '',
          data: null,
          className: 'delete',
          defaultContent: '<i style="color: brown; cursor: pointer" class="fa fa-trash"></>',
          responsivePriority: 1
        }

      ]
    };

    this.userRolesDatatable = $('#dtUserRoles').DataTable(dtOptions);



    $('#dtUserRoles tbody').on('click', 'td.edit', function () {
      let tr = $(this).closest('tr');
      var rowIndex = tr.index();
      console.log("eoo- ",rowIndex)
      let row = scope.userRolesDatatable.row(tr);
      let data = row.data();
      data['roles'] = scope.rolesData;
      data['tag'] = 'editUserRoles';
      data['rowIndex'] = rowIndex;
      scope.useridvalue = data.userID;
      console.log(data);
      scope.openModal2(UserRoleModalComponent, data);
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
      scope.openModal2(UserRoleModalComponent, data);
    });
  }

  initPermissionsDatatables(data) {
    console.log("qwqwee");
    let scope = this;
    this.dtOptionsPermission = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
      // dom: 'Bfrtip',

      columns: [
        {
          title: 'Module',
          data: 'clientname',
          className: "text-center"
        },
        {
          title: 'Entity Action',
          data: 'emailaddress',
          className: "text-center"
        },
        {
          title: 'Group',
          data: 'active',
          className: "text-center"
        },
        {
          title: 'Access',
          data: 'active',
          className: "text-center"
        },
        {
          title: 'Active',
          data: 'active',
          className: "text-center"
        },
        {
          title: '',
          data: null,
          className: 'edit',
          defaultContent: '<i style="color: blue ; cursor: pointer" class="fa fa-pencil"></>',
          responsivePriority: 1
        }
        ,{
          title: '',
          data: null,
          className: 'delete',
          defaultContent: '<i style="color: brown; cursor: pointer" class="fa fa-trash"></>',
          responsivePriority: 1
        }

      ]
    };

    this.dtPermission = $('#dtPermission').DataTable(this.dtOptionsPermission);

    $('#dtPermission tbody').on('click', 'td.edit', function () {
      let tr = $(this).closest('tr');
      let row = scope.dtPermission.row(tr);
      let data = row.data();

      scope.clientnamevalue = data.clientname;
      scope.fullnamevalue = data.fullname;
      scope.emailaddressvalue = data.emailaddress;
      scope.idnumbervalue = data.idnumber;
      scope.msisdnvalue = data.msisdn;
      console.log(data);
      scope.openModal(scope.editPermissionModal,'lg');
    });

    $('#dtPermission tbody').on('click', 'td.delete', function () {
      let tr = $(this).closest('tr');
      let row = scope.dtPermission.row(tr);
      let data = row.data();
      scope.clientnamevalue = data.clientname;
      scope.fullnamevalue = data.fullname;
      scope.emailaddressvalue = data.emailaddress;
      scope.idnumbervalue = data.idnumber;
      scope.msisdnvalue = data.msisdn;
      console.log(data);
      scope.openModal(scope.deletePermissionModal,'sm');
    });
  }

  initModuleActionsDatatables(data) {
    console.log("qwqwee");
    let scope = this;
    this.dtOptionsModuleAction = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
      // dom: 'Bfrtip',

      columns: [
        {
          title: 'Module',
          data: 'clientName',
          className: "text-center"
        },
        {
          title: 'Entity Action',
          data: 'emailAddress',
          className: "text-center"
        },
        {
          title: 'Action',
          data: 'active',
          className: "text-center"
        },
        {
          title: 'Label',
          data: 'active',
          className: "text-center"
        },
        {
          title: '',
          data: null,
          className: 'edit',
          defaultContent: '<i style="color: blue ; cursor: pointer" class="fa fa-pencil"></>',
          responsivePriority: 1
        }
        ,{
          title: '',
          data: null,
          className: 'delete',
          defaultContent: '<i style="color: brown; cursor: pointer" class="fa fa-trash"></>',
          responsivePriority: 1
        }

      ]
    };

    this.dtModuleAction = $('#dtModuleAction').DataTable(this.dtOptionsModuleAction);

    $('#dtModuleAction tbody').on('click', 'td.edit', function () {
      let tr = $(this).closest('tr');
      let row = scope.dtModuleAction.row(tr);
      let data = row.data();
      scope.clientnamevalue = data.clientname;
      scope.fullnamevalue = data.fullname;
      scope.emailaddressvalue = data.emailaddress;
      scope.idnumbervalue = data.idnumber;
      scope.msisdnvalue = data.msisdn;
      console.log(data);
      scope.openModal(scope.editModuleActionModal,'lg');
    });

    $('#dtModuleAction tbody').on('click', 'td.delete', function () {
      let tr = $(this).closest('tr');
      let row = scope.dtModuleAction.row(tr);
      let data = row.data();
      scope.clientnamevalue = data.clientname;
      scope.fullnamevalue = data.fullname;
      scope.emailaddressvalue = data.emailaddress;
      scope.idnumbervalue = data.idnumber;
      scope.msisdnvalue = data.msisdn;
      console.log(data);
      scope.openModal(scope.deleteModuleActionModal,'sm');
    });
  }

  editUser(user) {
    console.log("ssd-ttk- >",this.userId)
      this.api.updateUser(user['clientID'],this.userId, user).subscribe(
        data => {
          this.notifyService.showSuccess("Update successful", "Success");
          this.usersDatatable.row(user['rowIndex']).data(data).invalidate();
      }, error => {
        console.log(error);
        this.notifyService.showError("Something went wrong, please try again", "Oops");
      });
  }

  submitEditRole(form: NgForm) {
    console.log("pekele",form.value)
    let roleid = form.value.deleteroleid;
    let description = form.value.description;

    if (roleid == "" && description == ""){
        this.notifyService.showError("Please edit role","Validation")
        return;
    }

      this.api.updateRole(roleid, description).subscribe(
        data => {
          console.log("ssd----88 >",data)
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

  editRole(user) {
    console.log("pekelert",user)
    let roleid = user.roleID;
    let description = user.description;

      this.api.updateRole(roleid, description).subscribe(
        data => {
          console.log("ssd----88 >",data)
          this.notifyService.showSuccess("Update successful", "Success");
          //this.rolesDatatable.clear().rows.add(data).draw();
          this.rolesDatatable.row(user['rowIndex']).data(data).invalidate();
          //this.getRoles('datatables');
      }, error => {
        console.log(error);
        this.notifyService.showError("Something went wrong, please try again", "Oops");
      });
  }

  submitResetPassword(form: NgForm){
    console.log(form.value)
  }

  deleteUser(user){
    console.log("rttt", user);
    this.api.deleteUser(user['userID'], this.userId).subscribe(
      data => {
        console.log("ssd---- >",data)
        this.notifyService.showSuccess("Delete successful", "Success");

        var clientName = "";
        this.clientdata.forEach(element => {
          if (element['clientID'] == user['clientID']){
            console.log(element);
            clientName = element['clientName'];
          }
        });
        data['clientName'] = clientName;
        this.usersDatatable.row(user['rowIndex']).data(data).invalidate();
        //this.fetchUsers();
    }, error => {
      console.log(error);
      this.notifyService.showError("Something went wrong, please try again", "Oops");
    });
  }
  createUser(){
    let data = {clients: this.clientdata, userName: "", fullName: "", emailAddress: "", idNumber: "", msisdn: "",
     tag: "createUser", rowIndex: -1, canAccessUi: "Yes", password: "pass123", active: "Pending",
    passwordAttempts: 0, passwordStatusId: "Active", token: "1234", roleID: 1, userID: this.userId}
    this.openModal2(UserModalComponent, data);
  }

  createUser2(user) {

      this.api.saveUser(this.userId, user).subscribe(
        data => {
          this.loading = false;
          console.log("data 101 => ",data);
         // data['client']['clientName'] = 'Loading';
          //this.usersDatatable.row.add(data).draw(false);
          //this.fetchUsers();
          var client = "";
          this.clientdata.forEach(element => {
          if (element['clientID'] == user['clientID']){
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
          console.log("error => ",error);
          this.notifyService.showError("Something went wrong, please try again", "Something went wrong");
        }
      );
  }

  createRole(){
    //this.openModal(this.createRoleModal,'lg');
    let data = {tag: "createRole", rowIndex: -1, }
    this.openModal2(RoleModalComponent,data);
  }

  createRole2(user) {
    let roleName:string = user.roleName;
    let description:string = user.description;
    console.log("rty", roleName)
    if (roleName == '' || description == ""){
        console.log("hello world");
        this.notifyService.showError("Please enter all fields", "Warning");
        return;
    }

    let role = {roleName: roleName.toString().toUpperCase(), description: description, insertedBy: 1, updatedBy: 1, active: 1}

      this.api.saveRole(role).subscribe(
        data => {
          this.loading = false;
          console.log("data 101 => ",data);
          this.rolesDatatable.row.add(data).draw(false);
          this.notifyService.showSuccess("Role saved successfully", "Success");
        },
        error => {
          this.loading = false;
          console.log("error => ",error);
          this.notifyService.showError("Something went wrong, please try again", "Something went wrong");
        }
      );
  }

  submitDeleteRole(form: NgForm) {
    console.log("deleterole",form.value);
    let roleid = form.value.deleteroleid;

    this.api.deleteRole(roleid).subscribe(
      (data: User) => {
        console.log("ssd---- >",data)
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
    console.log("deleterole",user);
    let roleid = user.roleID;

    this.api.deleteRole(roleid).subscribe(
      data => {
        console.log("ssd---- >",data)
        console.log("ssd99-99---- >",user['rowIndex'])
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
        console.log("ssd---- >",data)
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
        console.log("ssd---- >",data)
        console.log("rowIndex---- >",rowIndex)
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
        console.log("ssd---- >",data)
        console.log("rowIndex---- >",rowIndex)
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
        console.log("ssd---- >",data)
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
