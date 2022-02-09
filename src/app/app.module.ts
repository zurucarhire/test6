import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '../../node_modules/@angular/common/http';
import { WindowrefService } from './service/windowref.service';
import { ApiService } from './service/api.service';
import { AuthGuard } from './guards/auth-guard';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { UserIdleModule } from 'angular-user-idle';
import { SearchModalComponent } from './modal/search-modal/search-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgbModule,
    UserIdleModule.forRoot({idle: 600, timeout: 300, ping: 120})
  ],
  // providers: [WindowrefService, AuthGuard, ApiService,MatDatepickerModule, {
  //   provide:HTTP_INTERCEPTORS, useClass:AuthenticationInterceptor, multi:true
  // }],
  providers: [WindowrefService, AuthGuard, ApiService, {
    provide:HTTP_INTERCEPTORS, useClass:AuthenticationInterceptor, multi:true
  }],
  //providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
