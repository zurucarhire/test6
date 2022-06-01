import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotAllowedComponent } from './not-allowed.component';


const routes: Routes = [{
  path: "",
  component: NotAllowedComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotAllowedRoutingModule { }
