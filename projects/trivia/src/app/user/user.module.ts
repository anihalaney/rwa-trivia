import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../../../shared-library/src/lib/shared/shared.module';
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
  QuestionAddUpdateComponent,
  RecentGameCardComponent
} from './components';
import { InviteFriendsComponent } from './components/invite-friends/invite-friends.component';
import { InviteFriendsDialogComponent } from './components/invite-friends/invite-friends-dialog/invite-friends-dialog.component';
import {
  InviteMailFriendsComponent
} from './components/invite-friends/invite-friends-dialog/invite-mail-friends/invite-mail-friends.component';

@NgModule({
  declarations: [
    ProfileCardComponent,
    UserStatsCardComponent,
    GameCardComponent,
    GameInviteComponent,
    RecentGamesComponent,
    ProfileSettingsComponent,
    MyQuestionsComponent,
    QuestionAddUpdateComponent,
    InviteFriendsComponent,
    InviteFriendsDialogComponent,
    InviteMailFriendsComponent,
    RecentGameCardComponent
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
    QuestionAddUpdateComponent,
    InviteFriendsComponent,
    InviteMailFriendsComponent,
    RecentGameCardComponent
  ],
  entryComponents: [
    InviteFriendsDialogComponent
  ]
})
export class UserModule { }
