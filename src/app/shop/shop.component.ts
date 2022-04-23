import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  items;
  //items = [{image: "mother1.webp"}, {image: "mother2.webp"}, {image: "mother3.webp"}];
  constructor(private router: Router, private api: ApiService) { }

  ngOnInit(): void {
    this.api.getProductCategories().subscribe(
      data => {
          console.log(data);
          this.items = data;
      },
      error => {
        console.log("error => ", error.status);

      }
    );
  }

  itemDetail(name){
    console.log(name)
    this.router.navigate(['/shopdetail', name]);
    //this.router.navigate(['/itemdetail', item, cost]);
  }

}
