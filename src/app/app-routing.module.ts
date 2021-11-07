import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AuthGuard } from './guards/auth-guard';
import { HomeComponent } from './home/home.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LoginComponent } from './login/login.component';
import { MerchantregistrationComponent } from './merchantregistration/merchantregistration.component';
import { RegisterComponent } from './register/register.component';
import { SettlementComponent } from './settlement/settlement.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { TransactionComponent } from './transaction/transaction.component';


const routes: Routes = [{path: '', redirectTo: '/', pathMatch: 'full'},
{path: '', component: LandingpageComponent},
{
  path: '',
  children: [
    { path: '', component: LandingpageComponent},
  ]
},
{
  path: 'signin',
  component: SigninComponent,
},
{
  path: 'login',
  component: LoginComponent,
},
{
  path: 'signup',
  component: SignupComponent,
},
{
  path: 'register',
  component: RegisterComponent,
},
{path:'home',component: HomeComponent, canActivate: [AuthGuard]},
{path:'merchantregistration',component: MerchantregistrationComponent, canActivate: [AuthGuard]},
{path:'invoices',component: InvoiceComponent, canActivate: [AuthGuard]},
{path:'settlements',component: SettlementComponent, canActivate: [AuthGuard]},
{path:'transactions',component: TransactionComponent, canActivate: [AuthGuard]},
{path:'account',component: AccountComponent, canActivate: [AuthGuard]},

{path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
