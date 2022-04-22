import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';
import * as CanvasJS from '../../assets/js/canvasjs.min.js';


declare var $;

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.css']
})
export class MerchantComponent implements OnInit {

  @ViewChild("editModal") editModal: TemplateRef<any>;
  @ViewChild("createModal") createModal: TemplateRef<any>;
  @ViewChild("deleteModal") deleteModal: TemplateRef<any>;

  public tabIndex = 0;
  loading = false;
  public message: string;
  public thumbnail: any;
  public imagePath;
  fileSize: number;
  productData: any;

  files: any;
  filesAccepted: boolean = false;

  private datatable1: any;
  private datatable2: any;
  closeResult: string;
  onsale = false;
  ondiscount = false;

  onsaleedit = false;
  ondiscountedit = false;

  rowIndex: any;
  rowToDelete: any;
  c: any;
  chart;
  //url: string = "https://zuru.co.ke";
  url: string = "http://localhost:8090";

  constructor(private notifyService: NotificationService, private api: ApiService,
    private router: Router, private http: HttpClient,private modalService: NgbModal) { }

  ngOnInit(): void {
   //this.getInventory(2);


  }


  ngAfterViewInit(): void {
    if (this.tabIndex == 1) {
      this.initDatatables1([]);
    }
    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      theme: "light2",
      title: {
        text: ""
      },
      data: [{
        type: "column",
        dataPoints: [
          { y: 71, label: "Pending Host Approval" },
          { y: 55, label: "Pending Customer Payment" },
          { y: 100, label: "Active Bookings" },
          { y: 10, label: "Canceled Bookings" },
          { y: 150, label: "Completed Bookings" }
        ]
      }]
    });

    chart.render();

  }

  getInventory(userId) {
    this.api.findProductByUserID(userId).subscribe(
      data => {
        console.log(data)
        this.datatable1.clear().rows.add(data).draw();
      }, error => {
        console.log(error);
      });
  }

  onSale(values:any):void {
    console.log(values.currentTarget.checked);
    if (values.currentTarget.checked){
      this.onsale = true;
    } else {
      this.onsale = false;
    }
  }

  onDiscount(values:any):void {
    console.log(values.currentTarget.checked);
    if (values.currentTarget.checked){
      this.ondiscount = true;
    } else {
      this.ondiscount = false;
    }
  }

  createProduct(){
    this.openModal(this.createModal, 'lg');
  }

  deleteProduct(data){
    console.log(data)
    let productName = data.name;
    let productId = data.productID;

    this.api.deleteProduct(productId).subscribe(
      data => {
        this.notifyService.showSuccess("Deleted " + productName, "Success");
        this.datatable1.row(this.rowToDelete).remove().draw();
        this.modalService.dismissAll();
      }, error => {
        this.notifyService.showError("Something went wrong, please try again", "Oops");
      });
  }


  initDatatables1(data) {
    let scope = this;
    let dtOptions = {
      data: data,
      "dom": 'ftipr',
      columns: [
        {
          data: null,
          className: 'details-control',
          defaultContent: '',
          responsivePriority: 1
        },
        {
          title: 'Name',
          data: 'name',
          className: "text-center"
        },
        {
          title: 'Price',
          data: 'price',
          className: "text-center"
        },
        {
          title: 'Overall Price',
          data: 'overallprice',
          className: "text-center"
        },
        {
          title: 'Count',
          data: 'count',
          className: "text-center"
        },
        {
          title: 'Discount',
          data: 'discount',
          className: "text-center"
        },
        {
          title: 'Sale',
          data: 'sale',
          className: "text-center"
        },
        {
          title: 'Date Created',
          data: 'dateCreated',
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

    this.datatable1 = $('#dt1').DataTable(dtOptions);

    $('#dt1 tbody').on('click', 'td.edit', function () {
      let tr = $(this).closest('tr');
      var rowIndex = tr.index();
      scope.rowIndex = rowIndex;
      let row = scope.datatable1.row(tr);
      let data = row.data();
      scope.productData = data;
      console.log(scope.productData)
      scope.openModal(scope.editModal, 'lg');
    });

    $('#dt1 tbody').on('click', 'td.delete', function () {
      let tr = $(this).closest('tr');
      var rowIndex = tr.index();
      let row = scope.datatable1.row(tr);
      let data = row.data();

      scope.rowToDelete = $(this).parents('tr');

      scope.productData = data;
      scope.openModal(scope.deleteModal, 'sm');
    });

    $('#dt1 tbody').on('click', 'td.details-control', function () {
      var tr = $(this).closest('tr');
      var row = scope.datatable1.row(tr);

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
      console.log(d.thumbnail);
      let splitThumbnail = d.thumbnail.split(",");
      let dRow = '';
      dRow = dRow + '<div class="container">';
      dRow = dRow + '<div class="row" style="margin: 10px"><tr><div class="col-12"><td>' + d.description + '</td></div></tr></div>';
      dRow = dRow + '<div class="row" style="margin: 10px"><tr>';
      for (let i =0; i<splitThumbnail.length;i++){
        //dRow = dRow + '<div class="col-3"><td>' + splitThumbnail[i] + '</td></div>';
        dRow = dRow + '<div class="col-4"><td><img class="img-responsive" width = "100%" src="http://52.91.60.228/assets/img/volvo.jpeg"></td></div>';

      }
      dRow = dRow + '</tr></div>';

      dRow = dRow + '</div>';
      return dRow;
    }
  }

  //   function format(d) {
  //     console.log(d.thumbnail);
  //     let splitThumbnail = d.thumbnail.split(",");
  //     let dRow = '';
  //     dRow = dRow + '<div class="container">';
  //     dRow = dRow + '<div class="row" style="margin: 20px"><tr><div class="col-2"><td>Description</td></div><div class="col-10"><td>' + d.description + '</td></div></tr></div>';
  //     dRow = dRow + '<div class="row" style="margin: 20px"><tr><div class="col-2"><td>Thumbnails</td></div>';
  //     for (let i =0; i<splitThumbnail.length;i++){
  //       // dRow = dRow + '<div class="col-3"><td>' + splitThumbnail[i] + '</td></div>';
  //       dRow = dRow + '<div class="col-3"><td><img class="img-responsive" width = "100%" src="http://52.91.60.228/assets/img/volvo.jpeg"></td></div>';

  //     }
  //     dRow = dRow + '</tr></div>';
  //     dRow = dRow + '</div>';
  //     return dRow;
  //   }
  // }

  selectedTab(e: MatTabChangeEvent) {
    let index = e.index;
    if (index == 0){
      //this.c.render();
    } else if (index == 1) {
      if (this.datatable1 == null || this.datatable1 == undefined) {
        this.initDatatables1([]);

      }
      this.getInventory(2);
    }
  }

  fileChangeEvent(files) {
    console.log(files);

    if (files.length === 0){
      this.filesAccepted = false;
      return;
    }


    var totalSize = 0;
    for (let i = 0; i < files.length; i++) {
      totalSize = totalSize + files[0]['size'] / 1000000;
    }

    if (files.length > 3) {
      this.filesAccepted = false;
      this.notifyService.showError("You can only upload a maximum of 3 photos", "Warning");
      return;
    }

    if (totalSize > 3) {
      this.filesAccepted = false;
      this.notifyService.showError("Image too large, maximum image size is 2mb", "Image too large");
      return
    }

    this.filesAccepted = true;
    this.files = files;
  }

  submit(form: NgForm) {
    console.log(form.value);
    console.log(sessionStorage.getItem('token'));
    if (this.fileSize == 0) {
      this.notifyService.showError("Please upload file", "Upload file");
      return
    }

    if (!this.filesAccepted) {
      this.notifyService.showError("Your files exceed the maximum size", "Maximum size");
      return
    }

    if (this.fileSize > 2) {
      this.notifyService.showError("Image too large, maximum image size is 2mb", "Image too large");
      return
    }

    let name = form.value.name;
    let price = form.value.price;
    let count = form.value.count;
    let description = form.value.description;

    let discount = "0";
    let sale = "0";

    if (this.onsale){
      sale = form.value.sale;
    }

    if (this.ondiscount){
      discount = form.value.discount;
    }

    let userID = sessionStorage.getItem("userID");


    const uploadData = new FormData();
    uploadData.append('userID', userID);
    uploadData.append('name', name);
    uploadData.append('price', price);
    uploadData.append('discount', discount);
    uploadData.append('sale', sale);
    uploadData.append('count', count);
    uploadData.append('description', description);
    for(let i=0;i<this.files.length;i++){
      uploadData.append('thumbnail', this.files[i]);
    }
    const options = {
      headers: new HttpHeaders()
        .set('Authorization', sessionStorage.getItem('token'))
    }

    this.http.post(this.url + '/api/psm/merchant/createproduct', uploadData, options)
      .subscribe(
        data => {
          this.loading = true;
          console.log("thedt ", data);
          this.modalService.dismissAll();
          this.notifyService.showSuccess("Added " + name, "Success");
          this.datatable1.row.add(data).draw(false);
        },
        error => {
          this.loading = false;

          if (error.status == 409){
            this.notifyService.showError("The product name already exists", "Product exists");
            return;
          }
          this.notifyService.showError("Something went wrong, please try again", "Failed");
        }
      );
  }

  update(form: NgForm) {
    if (this.fileSize > 2) {
      this.notifyService.showError("Image too large, maximum image size is 2mb", "Image too large");
      return
    }

    let price = form.value.price;
    let count = form.value.count;
    let description = form.value.description;
    let sale = form.value.sale;
    let discount = form.value.discount;

    console.log(this.productData['productID'])
    console.log(count)
    console.log(discount)
    console.log(sale)
    console.log(description)

    this.api.updateProduct(this.productData['productID'],price, count, discount, sale, description).subscribe(
      data => {
        this.notifyService.showSuccess("Update successful", "Success");
        this.datatable1.row(this.rowIndex).data(data).invalidate();
        this.modalService.dismissAll();
      }, error => {
        this.notifyService.showError("Something went wrong, please try again", "Oops");
        this.modalService.dismissAll();
      });
  }

  openModal(content, size) {
    this.modalService.open(content, { size: size, ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-holder', centered: true }).result.then((result) => {
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
}
