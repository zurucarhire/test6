import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpirycheckRoutingModule } from './expirycheck-routing.module';
import {MatCardModule} from '@angular/material/card';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ExpirycheckComponent } from './expirycheck.component';
import { SharedModule } from '../shared/shared.module';
import { ExpiryCheckModalComponent } from '../modal/expiry-check-modal/expiry-check-modal.component';

@NgModule({
  declarations: [ExpirycheckComponent,
    ExpiryCheckModalComponent],
  imports: [
    CommonModule,
    ExpirycheckRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MatCardModule
  ]
})
export class ExpirycheckModule { }
