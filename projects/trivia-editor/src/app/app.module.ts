import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// CustomSerializer
import { reducers } from './store';

import { CoreModule } from 'shared-library/core/core.module';
import { SharedModule } from 'shared-library/shared/shared.module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'shared-library/environments/environment';
import { RoutingModule } from './routing/routing.module';
import { NgQuillTexModule } from 'ng-quill-tex';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent
  ],
  imports: [
    CommonModule,
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

    NgQuillTexModule,

    BrowserModule.withServerTransition({ appId: 'trivia-editor' }),
    //BrowserTransferStateModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

