import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UsersComponent } from './users.component';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import * as $ from 'jquery';
import { UserModalComponent } from '../modal/user-modal/user-modal.component';
import { UserRoleModalComponent } from '../modal/user-role-modal/user-role-modal.component';
import { RoleModalComponent } from '../modal/role-modal/role-modal.component';

@NgModule({
  declarations: [UsersComponent,
    UserModalComponent,
    RoleModalComponent,
    UserRoleModalComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
