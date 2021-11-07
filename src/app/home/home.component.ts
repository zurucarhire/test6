import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as CanvasJS from '../../assets/js/canvasjs.min.js';
import { ApiService } from '../service/api.service.js';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username: string;
  registered = false;
  constructor(private router: Router, private api: ApiService,) { 
    let customer = JSON.parse(sessionStorage.getItem('customer'));
    let idpassport = customer["idpassport"];
    if (idpassport == "nil"){
      this.registered = false;
    } else {
      this.registered = true;
    }
    this.username = customer["username"];
  }

  ngOnInit(): void {
		this.setUpCharts();
  }

  merchantRegistration() {
    this.router.navigate(["merchantregistration"]);
  }

  checkSubmission() {
    this.router.navigate(["account"]);
  }

  setUpCharts(){
    var chart= new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2",
      title:{
        text: "My Settlements & Invoices"
      },
      axisX: {
        valueFormatString: "DD MMM"
      },
      axisY2: {
        minimum:25
      },
      toolTip: {
        shared: true
      },
      data: [{
        type: "stepLine",
        connectNullData: true,
        xValueFormatString: "MMM",
        name: "Settlements",
        dataPoints: [
          { x: new Date("2018-01-01T20:51:05.000Z"), y: 15.00 },
          { x: new Date("2018-02-02T20:51:05.000Z"), y: 14.50 },
          { x: new Date("2018-03-03T20:51:05.000Z"), y: 14.00 },
          { x: new Date("2018-04-04T20:51:05.000Z"), y: 14.50 },
          { x: new Date("2018-05-05T20:51:05.000Z"), y: 14.75 },
          { x: new Date("2018-06-06T20:51:05.000Z"), y: null },
          { x: new Date("2018-07-07T20:51:05.000Z"), y: 15.80 },
          { x: new Date("2018-08-08T20:51:05.000Z"), y: 17.50 }
        ]
      },
      {
        type: "stepLine",  
        connectNullData: true,
        xValueFormatString: "MMM",
        name: "Invoices",
        dataPoints: [
          { x: new Date("2018-01-01T20:51:05.000Z"), y: 25.00 },
          { x: new Date("2018-02-02T20:51:05.000Z"), y: 24.50 },
          { x: new Date("2018-03-03T20:51:05.000Z"), y: 22.00 },
          { x: new Date("2018-04-04T20:51:05.000Z"), y: 16.50 },
          { x: new Date("2018-05-05T20:51:05.000Z"), y: 6.75 },
          { x: new Date("2018-06-06T20:51:05.000Z"), y: null },
          { x: new Date("2018-07-07T20:51:05.000Z"), y: 7.80 },
          { x: new Date("2018-08-08T20:51:05.000Z"), y: 20.50 }
        ]
      }]
    });
    chart.render();

    let chart2 = new CanvasJS.Chart("chartContainer2", {
		theme: "light2",
		animationEnabled: true,
		exportEnabled: true,
		title:{
			text: "My Payments"
		},
		data: [{
			type: "pie",
			showInLegend: true,
			toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
			indexLabel: "{name} - #percent%",
			dataPoints: [
				{ y: 120, name: "Payment Links" },
				{ y: 300, name: "B2B Payments" },
				{ y: 800, name: "Bill Payments" },
				{ y: 150, name: "Ticketing" }
			]
		}]
	  });
		
	  chart.render();
		
	  chart2.render();
  }
}
