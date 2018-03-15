import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './routing/user-routing.module';

import { effects, reducer } from './store';

import {
  ProfileCardComponent,
  UserStatsCardComponent,
  GameCardComponent,
  GameInviteComponent,
  RecentGamesComponent,
  ProfileSettingsComponent,
  MyQuestionsComponent,
  QuestionAddUpdateComponent
} from './components';

@NgModule({
  declarations: [
    ProfileCardComponent,
    UserStatsCardComponent,
    GameCardComponent,
    GameInviteComponent,
    RecentGamesComponent,
    ProfileSettingsComponent,
    MyQuestionsComponent,
    QuestionAddUpdateComponent
  ],
  imports: [
    // rwa modules
    SharedModule,
    UserRoutingModule,

    //ngrx feature store
    StoreModule.forFeature('user', reducer),

    //ngrx effects
    EffectsModule.forFeature(effects),

  ],
  providers: [],
  exports: [
    ProfileCardComponent,
    UserStatsCardComponent,
    GameCardComponent,
    GameInviteComponent,
    RecentGamesComponent,
    ProfileSettingsComponent,
    MyQuestionsComponent,
    QuestionAddUpdateComponent
  ]
})
export class UserModule { }
