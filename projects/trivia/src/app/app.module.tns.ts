import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';

import { AppRoutingModule } from './app-routing.module.tns';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { reducers, CustomSerializer } from './store';
import { CoreModule } from './../../../shared-library/src/lib/core/core.module';
// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { HttpHeaders, HttpClientModule } from '@angular/common/http';

import { TestServiceService } from './../../../shared-library/src/test.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule,
    CoreModule,
    HttpClientModule,
  ],
  providers: [TestServiceService],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { 
  constructor(){
  }
}
