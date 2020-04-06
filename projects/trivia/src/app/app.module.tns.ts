import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { AppRoutingModule } from '../app/routing/app-routing.module';
import { AppComponent } from './../app/components/app/app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { reducers, metaReducers } from './store';
import { CoreModule } from 'shared-library/core/core.module';
import { SharedModule } from 'shared-library/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import * as TNSFirebase from 'nativescript-plugin-firebase';
import { PlatformFirebaseToken } from 'shared-library/core/db-service/tokens';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { registerElement } from 'nativescript-angular/element-registry';
import { RouterModule } from '@angular/router';
import { PrivacyPolicyComponent, AchievementsComponent } from './components';
import { UserFeedbackComponent } from './components/index.tns';
import { WelcomeScreenComponent } from '../../../shared-library/src/lib/shared/mobile/component';
import { ModalDialogService } from 'nativescript-angular/modal-dialog';
import { CardView } from '@nstudio/nativescript-cardview';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
export function firebaseFactory() {
  return TNSFirebase;
}

registerElement('PreviousNextView', () => require('nativescript-iqkeyboardmanager').PreviousNextView);
registerElement('CardView', () => CardView);
registerElement("NestedScrollView", () => require("nativescript-nested-scrollview").NestedScrollView);

@NgModule({
  declarations: [
    AppComponent,
    PrivacyPolicyComponent,
    AchievementsComponent,
    UserFeedbackComponent,
    WelcomeScreenComponent
  ],
  imports: [
    CoreModule,
    NativeScriptModule,
    AppRoutingModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreRouterConnectingModule.forRoot(),
    HttpClientModule,
    SharedModule,
    NativeScriptUISideDrawerModule,
    RouterModule,
    // BrowserAnimationsModule
  ],
  providers: [
    {
      provide: PlatformFirebaseToken,
      useFactory: firebaseFactory
    },
    ModalDialogService
  ],
  entryComponents: [
     WelcomeScreenComponent
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {
  constructor() { }
}
