import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { AppRoutingModule } from './app-routing.module.tns';
import { AppComponent } from './../app/components/app/app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { reducers } from './store';
import { CoreModule } from 'shared-library/core/core.module';
import { SharedModule } from 'shared-library/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { TNSFirebaseService } from './mobile/core/services/tns-firebase.service';
import { FirebaseService } from 'shared-library/core/db-service/firebase.service';
import * as TNSFirebase from 'nativescript-plugin-firebase';
import { PlatformFirebaseToken } from 'shared-library/core/db-service/tokens';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { QuestionComponent } from './components/question/question.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthorComponent } from 'shared-library/shared/components/author/author.component';
import { registerElement } from 'nativescript-angular/element-registry';
import { CardView } from 'nativescript-cardview';
import { StatsModule } from './stats/stats.module';
import { RouterModule } from '@angular/router';

export function firebaseFactory() {
  return TNSFirebase;
}
registerElement('CardView', () => CardView);

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    DashboardComponent,
    AuthorComponent,
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule,
    CoreModule,
    HttpClientModule,
    StatsModule,
    SharedModule,
    NativeScriptUISideDrawerModule,
    RouterModule
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
