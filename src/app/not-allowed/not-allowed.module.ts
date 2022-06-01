import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotAllowedRoutingModule } from './not-allowed-routing.module';
import { NotAllowedComponent } from './not-allowed.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [NotAllowedComponent],
  imports: [
    CommonModule,
    NotAllowedRoutingModule,
    SharedModule
  ]
})
export class NotAllowedModule { }
