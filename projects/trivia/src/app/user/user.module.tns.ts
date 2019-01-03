import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from 'shared-library/shared/shared.module';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { effects, reducer } from './store';
import { UserRoutingModule } from './routing/user-routing.module';


import {
  ProfileSettingsComponent,
  MyQuestionsComponent,
  InviteFriendsComponent,
  QuestionAddUpdateComponent,
  RecentGamesComponent,
  RecentGameCardComponent
} from './components';
import { InviteFriendsDialogComponent } from './components/invite-friends/invite-friends-dialog/invite-friends-dialog.component';
// tslint:disable-next-line:max-line-length
import { InviteMailFriendsComponent } from './components/invite-friends/invite-friends-dialog/invite-mail-friends/invite-mail-friends.component';

@NgModule({
  declarations: [
    ProfileSettingsComponent,
    QuestionAddUpdateComponent,
    MyQuestionsComponent,
    InviteFriendsComponent,
    QuestionAddUpdateComponent,
    InviteFriendsDialogComponent,
    InviteMailFriendsComponent,
    RecentGamesComponent,
    RecentGameCardComponent
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
    ProfileSettingsComponent,
    QuestionAddUpdateComponent,
    MyQuestionsComponent,
    InviteFriendsComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class UserModule { }
