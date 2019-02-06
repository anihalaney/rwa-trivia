import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { AppRoutingModule } from '../app/routing/app-routing.module';
import { AppComponent } from './../app/components/app/app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { reducers } from './store';
import { CoreModule } from 'shared-library/core/core.module';
import { SharedModule } from 'shared-library/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import * as TNSFirebase from 'nativescript-plugin-firebase';
import { PlatformFirebaseToken } from 'shared-library/core/db-service/tokens';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { QuestionComponent } from './components/question/question.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { registerElement } from 'nativescript-angular/element-registry';
import { StatsModule } from './stats/stats.module';
import { RouterModule } from '@angular/router';
import { GameCardComponent } from './components/game-card/game-card.component';
import { FriendInviteComponent } from './components/friend-invite/friend-invite.component';
import { GameInviteComponent } from './components/game-invite/game-invite.component';
export function firebaseFactory() {
  return TNSFirebase;
}


// registerElement('CardView', () => CardView);
registerElement('CardView', () => require('nativescript-cardview').CardView);
registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    DashboardComponent,
    GameCardComponent,
    FriendInviteComponent,
    GameInviteComponent
  ],
  imports: [
    CoreModule,
    NativeScriptModule,
    AppRoutingModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule.forRoot(),
    HttpClientModule,
    StatsModule,
    SharedModule,
    NativeScriptUISideDrawerModule,
    RouterModule
  ],
  providers: [
    {
      provide: PlatformFirebaseToken,
      useFactory: firebaseFactory
    },
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
