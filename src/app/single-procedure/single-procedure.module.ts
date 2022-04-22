import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SingleProcedureRoutingModule } from './single-procedure-routing.module';
import { SingleProcedureComponent } from './single-procedure.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import { ExperienceCommentModalComponent } from '../modal/experience-comment-modal/experience-comment-modal.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SingleProcedureComponent,ExperienceCommentModalComponent],
  imports: [
    CommonModule,
    SingleProcedureRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
  ]
})
export class SingleProcedureModule { }
