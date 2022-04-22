import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopDetailRoutingModule } from './shop-detail-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShopDetailComponent } from './shop-detail.component';
import { ShopDetailModalComponent } from '../modal/shop-detail-modal/shop-detail-modal.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ShopDetailComponent, ShopDetailModalComponent],
  imports: [
    CommonModule,
    ShopDetailRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ShopDetailModule { }
