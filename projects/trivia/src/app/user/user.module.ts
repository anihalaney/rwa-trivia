import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from 'shared-library/shared/shared.module';
import { UserRoutingModule } from './routing/user-routing.module';

import { effects, reducer } from './store';

import {
  ProfileCardComponent,
  UserStatsCardComponent,
  RecentGamesComponent,
  ProfileSettingsComponent,
  MyQuestionsComponent,
  QuestionAddUpdateComponent,
  RecentGameCardComponent,
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
    RecentGamesComponent,
    ProfileSettingsComponent,
    MyQuestionsComponent,
    QuestionAddUpdateComponent,
    InviteFriendsComponent,
    InviteFriendsDialogComponent,
    InviteMailFriendsComponent,
    RecentGameCardComponent,
    InviteFriendsDialogComponent
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
    RecentGamesComponent,
    ProfileSettingsComponent,
    MyQuestionsComponent,
    QuestionAddUpdateComponent,
    InviteFriendsComponent,
    InviteMailFriendsComponent,
    RecentGameCardComponent,
    InviteFriendsDialogComponent
  ],
  entryComponents: [
    InviteFriendsDialogComponent
  ]
})
export class UserModule { }
