import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountMerchantRoutingModule } from './account-merchant-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../shared/shared.module';
import { AccountMerchantComponent } from './account-merchant.component';


@NgModule({
  declarations: [AccountMerchantComponent],
  imports: [
    CommonModule,
    AccountMerchantRoutingModule,
    FormsModule,
    SharedModule,
    MatCardModule,
    ReactiveFormsModule
  ]
})
export class AccountMerchantModule { }
