import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import {MatCardModule} from '@angular/material/card';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [NavbarComponent,FooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule
  ],
  exports:[NavbarComponent,FooterComponent]
})
export class SharedModule { }
