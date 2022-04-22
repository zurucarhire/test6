import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShopNavbarComponent } from '../shop-navbar/shop-navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { HomeNavbarComponent } from '../home-navbar/home-navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ShopNavbarComponent, FooterComponent, HomeNavbarComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[ShopNavbarComponent, FooterComponent, HomeNavbarComponent]
})
export class SharedModule { }
