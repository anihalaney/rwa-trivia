import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from 'shared-library/shared/shared.module';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { effects, reducer } from './store';
import { UserRoutingModule } from './routing/user-routing.module';

import {
  GameCardComponent,
  ProfileSettingsComponent,
  InviteFriendsComponent
} from './components';

@NgModule({
  declarations: [
    GameCardComponent,
    ProfileSettingsComponent,
    InviteFriendsComponent
  ],
  imports: [
    // rwa modules
    SharedModule,
    NativeScriptRouterModule,
    UserRoutingModule,

    //ngrx feature store
    StoreModule.forFeature('user', reducer),

    //ngrx effects
    EffectsModule.forFeature(effects)


  ],
  providers: [],
  exports: [
    GameCardComponent,
    ProfileSettingsComponent,
    InviteFriendsComponent
  ]
})
export class UserModule { }
