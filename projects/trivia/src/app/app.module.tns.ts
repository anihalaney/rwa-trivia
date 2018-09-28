import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';

import { AppRoutingModule } from './app-routing.module.tns';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { reducers } from './store';
import { CoreModule } from './../../../shared-library/src/lib/core/core.module';
// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { HttpClientModule } from '@angular/common/http';
import { TNSFirebaseService } from './mobile/core/services/tns-firebase.service';
import { FirebaseService } from 'shared-library/core/db-service/firebase.service';
import * as TNSFirebase from 'nativescript-plugin-firebase';
import { PlatformFirebaseToken } from 'shared-library/core/db-service/tokens'
import { LeaderBoardComponent } from './mobile/components/leaderboard/leaderboard.component';
import { LoginComponent } from './mobile/components/login/login.component';
import { SharedModule } from "./mobile/shared";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { QuestionComponent } from "./components/question/question.component";
import { DashboardComponent } from  "./components/dashboard/dashboard.component";

export function firebaseFactory() {
  return TNSFirebase;
}

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    LoginComponent,
    LeaderBoardComponent,
    // QuestionComponent,
    DashboardComponent
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule,
    CoreModule,
    HttpClientModule,
    SharedModule,
    NativeScriptUISideDrawerModule
  ],
  providers: [
    TNSFirebaseService,
    {
      provide: PlatformFirebaseToken,
      useFactory: firebaseFactory
    },
    {
      provide: FirebaseService,
      useClass: TNSFirebaseService
    },
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {
  constructor() {
  }
}
