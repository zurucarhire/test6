import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcedureRoutingModule } from './procedure-routing.module';
import { ProcedureComponent } from './procedure.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RoleModalComponent } from '../modal/role-modal/role-modal.component';
import { QuestionModalComponent } from '../modal/question-modal/question-modal.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ProcedureComponent,
    RoleModalComponent, QuestionModalComponent],
  imports: [
    CommonModule,
    ProcedureRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProcedureModule { }
