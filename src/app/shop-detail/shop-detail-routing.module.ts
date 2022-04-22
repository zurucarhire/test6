import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopDetailComponent } from './shop-detail.component';


const routes: Routes = [{
  path: "",
  component: ShopDetailComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopDetailRoutingModule { }
