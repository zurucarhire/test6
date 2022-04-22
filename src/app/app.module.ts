import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '../../node_modules/@angular/common/http';
import { AuthGuard } from './guards/auth-guard';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { UserIdleModule } from 'angular-user-idle';
import { ApiService } from './service/api.service';
import { AngularFireModule } from '@angular/fire';
import { SharedModule } from './shared/shared.module';

const firebaseConfig = {
  apiKey: "AIzaSyBKY87WgI7o4J23j8Z5yv-urPRCO4Fmd8k",
  authDomain: "psmproject-f2a57.firebaseapp.com",
  projectId: "psmproject-f2a57",
  storageBucket: "psmproject-f2a57.appspot.com",
  messagingSenderId: "866939020992",
  appId: "1:866939020992:web:d52fc5c36634c99ce92f25",
  measurementId: "G-SRK7NX476C"
};
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    ToastrModule.forRoot(
      {timeOut: 3000,
        positionClass: 'toast-bottom-left',
        preventDuplicates: true,}
    ),
    NgbModule,
    SharedModule,
    UserIdleModule.forRoot({idle: 600, timeout: 300, ping: 120})
  ],
  exports:[SharedModule],
  // providers: [WindowrefService, AuthGuard, ApiService,MatDatepickerModule, {
  //   provide:HTTP_INTERCEPTORS, useClass:AuthenticationInterceptor, multi:true
  // }],
  providers: [AuthGuard,ApiService, {
    provide:HTTP_INTERCEPTORS, useClass:AuthenticationInterceptor, multi:true
  }],
  //providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
