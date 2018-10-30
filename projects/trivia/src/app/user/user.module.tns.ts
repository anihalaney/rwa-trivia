import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from 'shared-library/shared/shared.module';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { effects, reducer } from './store';

import {
  GameCardComponent,
} from './components';

@NgModule({
  declarations: [
    GameCardComponent,
  ],
  imports: [
    // rwa modules
    SharedModule,
    NativeScriptRouterModule,

    //ngrx feature store
    StoreModule.forFeature('user', reducer),

    //ngrx effects
    EffectsModule.forFeature(effects),

  ],
  providers: [],
  exports: [
    GameCardComponent,
  ]
})
export class UserModule { }
