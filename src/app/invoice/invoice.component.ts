import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { WindowrefService } from '../service/windowref.service';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive'

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  @ViewChild('dataTable', { static: false }) table: ElementRef;
  dataTable: any;
  dtOptions: any;
  data = [];
  constructor(private winRef: WindowrefService) { }

  ngOnInit(): void {
    let mythis = $(this.winRef.nativeWindow.document.body);
    let ts = this;
    this.dtOptions = {
      data: this.data,
      bDestroy: true,
      responsive: true,
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'print',
          // title: function() {
          //   return "<div style='font-size: 20px; margin-left: 10px;'>Wallet Statement</div>";
          // } ,
          text: '<span style="font-family: Baloo2-SemiBold; padding: 8px; "><i style="margin-right: 10px" class="fa fa-print"></i> Print</span>',
          title: '',
          filename: 'adamwalletstatement',
          customize: function (win) {
            console.log(win);
            win.defaultStyle = { font: 'Montserrat' }
            $(win.document.body).find('th').addClass('compact').css({ 'font-family': 'inherit', 'text-align':'center', 'font-size': '14px' });
            $(win.document.body).find('td').addClass('compact').css({ 'font-size': '12px','text-align':'center' });
            // $(win.document.body).prepend('<div id="header" style="text-align: center; margin-top: 0px"><img src="http://13.234.38.19/adamlogo4.png"><h6 style="margin-top: 20px; font-family: inherit; color:firebrick; font-weight: bold; font-size: 18px;">ADAM</h6><p style="margin-top: -10px; font-size: 11px; color:firebrick; font-family: inherit;">support@adam.com, 0721828831</p><hr style="border: 1px dotted #000; margin-left: 0px; margin-right:10px;"><hr style="border: 1px solid #000; margin-left: 0px; margin-right:10px; margin-top: -15px"><p style="font-weight: bold;">Fund Statement</p><div style="width: 100%;"><div style="float: left"><span style="font-family: inherit; font-size: 13px; font-weight: bold">Name: </span><span style="margin-right: 10px;font-family: inherit; font-size: 12px;">' + "hello" + '</span></div><div style="float: right"><span style="font-family: inherit; font-size: 13px; font-weight: bold">ADAM Money Market Fund: </span><span style="font-family: inherit; font-size: 12px;">Ksh ' + "world" + '</span></div></div><br><div style="width: 100%;"><div style="float: left"><span style="font-family: inherit; font-size: 13px; font-weight: bold">Email: </span><span style="margin-right: 10px;font-family: inherit; font-size: 12px;">' + "nijea" + '</span></div><div style="float: right"><span style="font-family: inherit; font-size: 13px; font-weight: bold">ADAM Fixed Income Fund: </span><span style="font-family: inherit; font-size: 12px;">Ksh ' + "oyaa" + '</span></div></div><br><div style="width: 100%;"><div style="float: left"><span style="font-family: inherit; font-size: 13px; font-weight: bold">Phone: </span><span style="margin-right: 10px;font-family: inherit; font-size: 12px;">' + "ole" + '</span></div><div style="float: right"><span style="font-family: inherit; font-size: 13px; font-weight: bold">ADAM Equities Fund: </span><span style="font-family: inherit; font-size: 12px;">Ksh ' + "pangzi" + '</span></div></div><br><div style="width: 100%;"><div style="float: left"><span style="font-family: inherit; font-size: 13px; font-weight: bold"></span><span style="margin-right: 10px;font-family: inherit; font-size: 12px;"></span></div><div style="float: right"><span style="font-family: inherit; font-size: 13px; font-weight: bold">ADAM Properties Fund: </span><span style="font-family: inherit; font-size: 12px;">Ksh ' + "mbwegeze" + '</span></div></div><br><div style="width: 100%;"><div style="float: left"><span style="font-family: inherit; font-size: 13px; font-weight: bold"></span><span style="margin-right: 10px;font-family: inherit; font-size: 12px;"></span></div><div style="float: right"><span style="font-family: inherit; font-size: 13px; font-weight: bold">ADAM Business Growth Fund: </span><span style="font-family: inherit; font-size: 12px;">Ksh ' + "tunafuacha" + '</span></div></div></div>');
            $(win.document.body).find('table').addClass('compact').css({ 'border': '1px solid #000', 'margin': '50px 0 0 0', 'font-family': 'inherit' });

          }
        }],
      columns: [
        {
          title: 'Invoice Date',
          data: 'activitydate',
          className: 'my_class'
        },
        {
          title: 'Invoice ID',
          data: 'transactionid',
          className: 'my_class'
        },
        {
          title: 'Description',
          data: 'description',
          className: 'my_class'
        },
        {
          title: 'Amount',
          data: 'balance',
          className: 'my_class'
        }
      ]
    };
    var table = $('.datatable').DataTable(this.dtOptions);
  }

}

