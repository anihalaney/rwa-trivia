import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducers, CustomSerializer } from './store';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { RoutingModule } from './routing/routing.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';

import {
  AppComponent, DashboardComponent,
  SideNavComponent, HeaderComponent, FooterComponent, InvitationRedirectionComponent
} from './components';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SideNavComponent,
    HeaderComponent,
    FooterComponent,
    InvitationRedirectionComponent
  ],
  imports: [
    BrowserModule,

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
    AdminModule,
    UserModule
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
