import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpirycheckComponent } from './expirycheck.component';


const routes: Routes = [{
  path: "",
  component: ExpirycheckComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpirycheckRoutingModule { }
