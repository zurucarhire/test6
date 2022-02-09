import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditRoutingModule } from './audit-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AuditComponent } from './audit.component';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  declarations: [AuditComponent],
  imports: [
    CommonModule,
    AuditRoutingModule,
    SharedModule,
    MatCardModule,
    MatTabsModule
  ]
})
export class AuditModule { }
