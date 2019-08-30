import { BrowserModule, BrowserTransferStateModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Inject, NgZone } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { SharedModule } from 'shared-library/shared/shared.module';
import { CoreModule } from 'shared-library/core/core.module';
import { reducers, CustomSerializer } from './store';
import { RoutingModule } from './routing/routing.module';

import { LazyLoadImagesModule } from 'ngx-lazy-load-images';
import { CookieLawModule } from 'angular2-cookie-law';

import {
  AppComponent,
  SideNavComponent, HeaderComponent, FooterComponent, InvitationRedirectionComponent,
  PrivacyPolicyComponent, UserStatsCardComponent, RecentGameCardComponent, RecentGamesComponent,
  ProfileCardComponent, AchievementsComponent,
} from './components';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'shared-library/environments/environment';
import { SwUpdate } from '@angular/service-worker';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { interval } from 'rxjs';
import { WindowRef } from 'shared-library/core/services';

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    HeaderComponent,
    FooterComponent,
    InvitationRedirectionComponent,
    PrivacyPolicyComponent,
    ProfileCardComponent,
    RecentGamesComponent,
    RecentGameCardComponent,
    UserStatsCardComponent,
    AchievementsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LazyLoadImagesModule,
    CookieLawModule,

    EffectsModule.forRoot([]),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 20
    }),
    //StoreModule.forRoot(reducers),
    StoreRouterConnectingModule.forRoot(),

    //rwa modules
    CoreModule,
    SharedModule,
    RoutingModule,
    BrowserModule.withServerTransition({ appId: 'trivia' }),
    //BrowserTransferStateModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer }, Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(updates: SwUpdate, @Inject(PLATFORM_ID) private platformId: Object, ngZone: NgZone, private windowRef: WindowRef) {

    if (isPlatformBrowser(this.platformId) && environment.production) {

      if (updates.isEnabled) {
        updates.available.subscribe(() => {
          alert('New version available. Load New Version?');
          windowRef.nativeWindow.location.reload();
        });
      }
      ngZone.runOutsideAngular(() => {
        interval(60000).subscribe(() => {
          ngZone.run(() => updates.checkForUpdate());
        });
      });
    }

  }
}
