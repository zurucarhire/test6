import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';


const routes: Routes = [{path: '', redirectTo: '/', pathMatch: 'full'},
{
  path: '',
  loadChildren: () => import('src/app/login/login.module').then(m => m.LoginModule)
},
{
  path: 'home', canActivate: [AuthGuard],
  loadChildren: () => import('src/app/home/home.module').then(m => m.HomeModule)
},
{
  path: 'users', canActivate: [AuthGuard],
  loadChildren: () => import('src/app/users/users.module').then(m => m.UsersModule)
},
{
  path: 'audit',canActivate: [AuthGuard],
  loadChildren: () => import('src/app/audit/audit.module').then(m => m.AuditModule)
},
{
  path: 'account',
  loadChildren: () => import('src/app/account/account.module').then(m => m.AccountModule)
},
{
  path: 'expiry',
  loadChildren: () => import('src/app/expirycheck/expirycheck.module').then(m => m.ExpirycheckModule)
},
{
  path: 'report',
  loadChildren: () => import('src/app/report/report.module').then(m => m.ReportModule)
},
{path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
