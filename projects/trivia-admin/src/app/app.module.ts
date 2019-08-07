import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducers, CustomSerializer } from './store';

import { CoreModule } from 'shared-library/core/core.module';
import { SharedModule } from 'shared-library/shared/shared.module';
import { RoutingModule } from './routing/routing.module';

import {
  AppComponent, DashboardComponent,
  HeaderComponent, FooterComponent
} from './components';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'shared-library/environments/environment';
import {APP_BASE_HREF} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    EffectsModule.forRoot([]),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 20
    }),

    StoreRouterConnectingModule.forRoot(),

    //rwa modules
    CoreModule,
    SharedModule,
    RoutingModule,


    BrowserModule.withServerTransition({ appId: 'trivia-admin' }),
    //BrowserTransferStateModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    { provide: APP_BASE_HREF, useValue: '/'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
