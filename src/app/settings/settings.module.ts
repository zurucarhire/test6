import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import {MatCardModule} from '@angular/material/card';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../shared/shared.module';
import { ExpiryCheckModalComponent } from '../modal/expiry-check-modal/expiry-check-modal.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ClientModalComponent } from '../modal/client-modal/client-modal.component';
import { RequestTypeModalComponent } from '../modal/request-type-modal/request-type-modal.component';

@NgModule({
  declarations: [SettingsComponent,
    ClientModalComponent, RequestTypeModalComponent,
    ExpiryCheckModalComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule
  ]
})
export class SettingsModule { }
