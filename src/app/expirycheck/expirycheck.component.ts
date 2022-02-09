import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpiryCheckModalComponent } from '../modal/expiry-check-modal/expiry-check-modal.component';
import { User } from '../model/user';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';
declare var $;

@Component({
  selector: 'app-expirycheck',
  templateUrl: './expirycheck.component.html',
  styleUrls: ['./expirycheck.component.css']
})
export class ExpirycheckComponent implements OnInit {

  exipiryCheckDatatable;

  roleId;
  constructor(private notifyService: NotificationService,
    private api: ApiService,private modalService: NgbModal) { }

  ngOnInit(): void {
    let user = JSON.parse(sessionStorage.getItem('user'));
    this.roleId = user["user"]["roleID"];

    this.initExpiryCheckDatatables([]);

    this.getExpiry();
  }

  openModal2(view, data) {
    const modalRef = this.modalService.open(view, {centered: true });
    modalRef.componentInstance.modalData = data;
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
        if (result['tag'] == 'edit'){
          this.editExpiryPeriod(result);
        } else if (result['tag'] == 'delete'){
          this.deleteExpiryPeriod(result);
        }
      }
    });
  }

  editExpiryPeriod(data) {
    console.log("pekelert",data)
    let id = data.expiryID;
    let period = data.expiryPeriod;

      this.api.updateExpiryPeriod(id, period).subscribe(
        data => {
          console.log("ssd----88 >",data)
          this.notifyService.showSuccess("Update successful", "Success");
          this.exipiryCheckDatatable.row(data['rowIndex']).data(data).invalidate();
      }, error => {
        console.log(error);
        this.notifyService.showError("Something went wrong, please try again", "Oops");
      });
  }

  deleteExpiryPeriod(data){
    console.log("rttt", data);
    this.api.deleteExpiryPeriod(data['expiryID']).subscribe(
      data => {
        console.log("ssd---- >",data)
        this.notifyService.showSuccess("Delete successful", "Success");

        this.exipiryCheckDatatable.row(data['rowIndex']).data(data).invalidate();
        //this.exipiryCheckDatatable.row(user['rowIndex']).data(data).invalidate();
        //this.fetchUsers();
    }, error => {
      console.log(error);
      this.notifyService.showError("Something went wrong, please try again", "Oops");
    });
  }

  getExpiry(){
    this.api.findExpiry().subscribe(
      data => {
        this.exipiryCheckDatatable.clear().rows.add(data).draw();
    }, error => {
      console.log(error);
    });
  }

  createUser(){

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
          title: 'User ID',
          data: 'userID',
          className: "text-center"
        },
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
        ,{
          title: '',
          data: null,
          className: 'delete',
          defaultContent: '<i style="color: brown; cursor: pointer" class="fa fa-trash"></>',
          responsivePriority: 1
        }

      ]
    };

    this.exipiryCheckDatatable = $('#dt').DataTable(dtOptions);

    $('#dt tbody').on('click', 'td.edit', function () {
      console.log("hello2");
      let tr = $(this).closest('tr');
      var rowIndex = tr.index();
      let row = scope.exipiryCheckDatatable.row(tr);
      let data = row.data();

      let user = JSON.parse(sessionStorage.getItem('user'));
      let role = user["user"]["roleID"];
      console.log("the rolexxxx", role);
      if (role == 2){
        scope.notifyService.showError("You do not have permissions to perform this action","Permission Denied");
        return
      }

      // data['clients'] = scope.clientdata;
      data['tag'] = 'edit';
      data['rowIndex'] = rowIndex;

       scope.openModal2(ExpiryCheckModalComponent,data);
    });

    $('#dt tbody').on('click', 'td.delete', function () {
      let tr = $(this).closest('tr');
      var rowIndex = tr.index();
      let row = scope.exipiryCheckDatatable.row(tr);
      let data = row.data();

      let user = JSON.parse(sessionStorage.getItem('user'));
      let role = user["user"]["roleID"];
      console.log("the rolexxxx", role);
      if (role == 2){
        scope.notifyService.showError("You do not have permissions to perform this action","Permission Denied");
        return
      }

      // data['clients'] = scope.clientdata;
      data['tag'] = 'delete';
      data['rowIndex'] = rowIndex;

       scope.openModal2(ExpiryCheckModalComponent,data);
    });
  }

}
