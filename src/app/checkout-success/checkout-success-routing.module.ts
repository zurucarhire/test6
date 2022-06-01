import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckoutSuccessComponent } from './checkout-success.component';


const routes: Routes = [{
  path: "",
  component: CheckoutSuccessComponent
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutSuccessRoutingModule { }
