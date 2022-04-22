import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  items = [{image: "mother1.webp"}, {image: "mother2.webp"}, {image: "mother3.webp"}];
  constructor(private router: Router, private api: ApiService) { }

  ngOnInit(): void {
    this.api.getProducts().subscribe(
      data => {
          console.log(data);
      },
      error => {
        console.log("error => ", error.status);

      }
    );
  }

  itemDetail(){
    this.router.navigate(['/shopdetail']);
  }

}
