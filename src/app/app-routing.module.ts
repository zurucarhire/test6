import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';


const routes: Routes = [{path: '', redirectTo: '/', pathMatch: 'full'},
{
  path: '',
  loadChildren: () => import('src/app/landing-page/landing-page.module').then(m => m.LandingPageModule)
},
{
  path: 'login',
  loadChildren: () => import('src/app/login/login.module').then(m => m.LoginModule)
},
{
  path: 'signup',
  loadChildren: () => import('src/app/signup/signup.module').then(m => m.SignupModule)
},
{
  path: 'account',
  loadChildren: () => import('src/app/account/account.module').then(m => m.AccountModule)
},
{
  path: 'procedure',
  loadChildren: () => import('src/app/procedure/procedure.module').then(m => m.ProcedureModule)
},
{
  path: 'questions',
  loadChildren: () => import('src/app/questions/questions.module').then(m => m.QuestionsModule)
},
{
  path: 'experiences',
  loadChildren: () => import('src/app/experiences/experiences.module').then(m => m.ExperiencesModule)
},
{
  path: 'shop',
  loadChildren: () => import('src/app/shop/shop.module').then(m => m.ShopModule)
},
{
  path: 'shopdetail/:name',
  loadChildren: () => import('src/app/shop-detail/shop-detail.module').then(m => m.ShopDetailModule)
},
{
  path: 'itemdetail/:id',
  loadChildren: () => import('src/app/item-detail/item-detail.module').then(m => m.ItemDetailModule)
},
{
  path: 'checkout',
  loadChildren: () => import('src/app/checkout/checkout.module').then(m => m.CheckoutModule)
},
{
  path: 'cart',
  loadChildren: () => import('src/app/cart/cart.module').then(m => m.CartModule)
},
{
  path: 'merchant',
  loadChildren: () => import('src/app/merchant/merchant.module').then(m => m.MerchantModule)
},
{
  path: 'singleprocedure/:name',
  loadChildren: () => import('src/app/single-procedure/single-procedure.module').then(m => m.SingleProcedureModule)
},

{path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
