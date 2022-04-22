import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemDetailRoutingModule } from './item-detail-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemDetailComponent } from './item-detail.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ItemDetailComponent],
  imports: [
    CommonModule,
    ItemDetailRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ItemDetailModule { }
