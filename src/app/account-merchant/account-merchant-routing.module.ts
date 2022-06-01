import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountMerchantComponent } from './account-merchant.component';


const routes: Routes = [{
  path: "",
  component: AccountMerchantComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountMerchantRoutingModule { }
