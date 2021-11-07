import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { MainNavBarComponent } from './main-nav-bar/main-nav-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import { MerchantregistrationComponent } from './merchantregistration/merchantregistration.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '../../node_modules/@angular/common/http';
import { InvoiceComponent } from './invoice/invoice.component';
import { TransactionComponent } from './transaction/transaction.component';
import { SettlementComponent } from './settlement/settlement.component';
import { WindowrefService } from './service/windowref.service';
import { FooterComponent } from './footer/footer.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { NilNavBarComponent } from './nil-nav-bar/nil-nav-bar.component';
import { RegisterComponent } from './register/register.component';
import { ApiService } from './service/api.service';
import { AuthGuard } from './guards/auth-guard';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    LandingpageComponent,
    SigninComponent,
    SignupComponent,
    HomeComponent,
    MainNavBarComponent,
    MerchantregistrationComponent,
    InvoiceComponent,
    TransactionComponent,
    SettlementComponent,
    FooterComponent,
    AccountComponent,
    LoginComponent,
    NilNavBarComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgbModule
  ],
  //providers: [WindowrefService],
  providers: [WindowrefService, AuthGuard, ApiService, {
    provide:HTTP_INTERCEPTORS, useClass:AuthenticationInterceptor, multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
