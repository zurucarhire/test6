import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExperiencesRoutingModule } from './experiences-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExperiencesComponent } from './experiences.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ExperiencesComponent],
  imports: [
    CommonModule,
    ExperiencesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ExperiencesModule { }
