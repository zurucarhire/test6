import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingleProcedureComponent } from './single-procedure.component';


const routes: Routes = [{
  path: "",
  component: SingleProcedureComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleProcedureRoutingModule { }
