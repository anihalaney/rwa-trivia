import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Inject, NgZone } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { SharedModule, CoreModule } from '../../../../projects/shared-library/src/public_api';
import { reducers, CustomSerializer } from './store';
import { RoutingModule } from './routing/routing.module';

import { GamePlayModule } from './game-play/game-play.module';
import { SocialModule } from './social/social.module';
import { UserModule } from './user/user.module';
import { StatsModule } from './stats/stats.module';

import {
  AppComponent, DashboardComponent, QuestionComponent,
  SideNavComponent, HeaderComponent, FooterComponent, InvitationRedirectionComponent
} from './components';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../../../shared-library/src/lib/environments/environment';
import { SwUpdate } from '@angular/service-worker';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { interval } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    QuestionComponent,
    SideNavComponent,
    HeaderComponent,
    FooterComponent,
    InvitationRedirectionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    EffectsModule.forRoot([]),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 20
    }),
    //StoreModule.forRoot(reducers),
    StoreRouterConnectingModule,

    //rwa modules
    CoreModule,
    SharedModule,
    RoutingModule,
    GamePlayModule,
    SocialModule,
    UserModule,
    StatsModule,
    BrowserModule.withServerTransition({ appId: 'trivia' }),
    //BrowserTransferStateModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(updates: SwUpdate, @Inject(PLATFORM_ID) private platformId: Object, ngZone: NgZone) {

    if (isPlatformBrowser(this.platformId)) {
      console.log('Service worker update called');
      updates.available.subscribe(event => {
        console.log('current version is', event.current);
        console.log('available version is', event.available);
        updates.activateUpdate().then(() => document.location.reload());
      });
      updates.activated.subscribe(event => {
        console.log('old version was', event.previous);
        console.log('new version is', event.current);
      });

      ngZone.runOutsideAngular(() => {
        interval(60000).subscribe(() => {
          console.log('Inside Interval')
          ngZone.run(() => updates.checkForUpdate());
        });
      });
    }

  }
}
