import { Component, OnInit } from '@angular/core';
const url = "../../assets/js/plugins  .js";
const url2= "../../assets/js/active.js";
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})

export class ShoppingCartComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {
   // this.loadScript();
   // this.loadScript2();
  }

  public loadScript() {
    console.log('preparing to load...')
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
}

public loadScript2() {
  console.log('preparing to load...')
  let node = document.createElement('script');
  node.src = url2;
  node.type = 'text/javascript';
  node.async = true;
  node.charset = 'utf-8';
  document.getElementsByTagName('head')[0].appendChild(node);
}
}
