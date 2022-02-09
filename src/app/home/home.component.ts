import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleModalComponent } from '../modal/role-modal/role-modal.component';
import { SearchModalComponent } from '../modal/search-modal/search-modal.component';
import { Requesttype } from '../model/requesttype';
import { User } from '../model/user';
import { ApiService } from '../service/api.service';
declare var $;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  printData;
  loading = false;
  data = [];
  d;
  searchData;
  searchDatatable:any;
  requesttypedata: Requesttype[];
  constructor(private api: ApiService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.fetchRequestTypes()
    //this.getSearch();
    this.initSearchDatatables([]);
  }

  fetchRequestTypes(){
    this.api.findAllRequestTypes().subscribe(
      (data: Requesttype[]) => {
        this.requesttypedata = data;
    }, error => {
      console.log(error);
    });
  }

  openModal2(view, data) {
    const modalRef = this.modalService.open(view, {centered: true });
    modalRef.componentInstance.modalData = data;
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);

      }
    });
  }

  getSearch(){
    this.api.findAllUsers().subscribe(
      (data: User[]) => {
        this.data = data;
       // this.initSearchCustomerDatatable(data);
    }, error => {
      console.log(error);
    });
  }

  print(){
    this.openModal2(SearchModalComponent,this.searchData);
  }

  initSearchDatatables(data) {
  // console.log("qwqwee ", this.d[0]['citizenship']);
    let dtOptionsSearchLogs = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
      lengthMenu: [5, 10],
      //dom:'Bfrtip',
      // buttons: [
      //   {
      //     extend: 'excel',
      //     exportOptions: {
      //         columns: [ 0, 1, 2, 3, 4 ]
      //     }
      //   }
      // ],
    //   buttons: [
    //     {
    //         extend: 'print',
    //         exportOptions: {
    //             stripHtml : false,
    //             columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
    //             //specify which column you want to print

    //         }
    //     }

    // ],
    //dom: 'Bfrtip',
        // buttons: [
        //     {
        //         extend: 'pdfHtml5',
        //         customize: function ( doc ) {
        //             doc.content.splice( 1, 0, {
        //                 margin: [ 0, 0, 0, 12 ],
        //                 alignment: 'center',
        //                 image: "data:image/png;https://shikatei.co.ke/liquoricon.jpg"
        //               } );
        //         }
        //     }
        // ],
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
          // render : function ( url, type, full) {
          //   return '<img height="75%" width="75%" src="https://shikatei.co.ke/liquoricon.jpg"/>';
          // },
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
        },{
          title: '',
          data: null,
          className: 'delete',
          defaultContent: '<i style="color: blue; cursor: pointer; text-align: center" class="fa fa-print"></>',
          responsivePriority: 1
        }
      ]
    };

    this.searchDatatable = $('#dtSearchCustomer').DataTable(dtOptionsSearchLogs);

    let scope = this;
    $('#dtSearchCustomer tbody').on('click', 'td.delete', function () {
      let tr = $(this).closest('tr');
      let row = scope.searchDatatable.row(tr);
      var rowIndex = tr.index();

      let data = row.data();
      scope.printData = data;
      console.log(data)
     scope.openModal2(SearchModalComponent,data);
      //scope.openModal(scope.deleteRoleModal,'sm');
    });
    $('#dtSearchCustomer tbody').on('click', 'td.details-control', function () {
      var tr = $(this).closest('tr');
      var row = scope.searchDatatable.row(tr);
      console.log("hooray")
      var rowIndex = tr.index();
      let data = row.data();


      //scope.openModal2(scope.searchLogsModal);
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

  searchSubmit(form: NgForm){
    console.log(form.value)
    this.api.findAllSearch2(form.value.requesttype).subscribe(
      data => {
        console.log("data => ", data);
        console.log("data => ", data[0]['citizenship']);
        this.d = data;
        this.searchDatatable.clear().rows.add(data).draw();
    }, error => {
      console.log(error);
    });
  }
}
