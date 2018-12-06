import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from 'shared-library/shared/shared.module';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { effects, reducer } from './store';
import { UserRoutingModule } from './routing/user-routing.module';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';

import {
  ProfileSettingsComponent,
  MyQuestionsComponent,
  InviteFriendsComponent,
  QuestionAddUpdateComponent
} from './components';
import { InviteFriendsDialogComponent } from './components/invite-friends/invite-friends-dialog/invite-friends-dialog.component';

@NgModule({
  declarations: [
    ProfileSettingsComponent,
    QuestionAddUpdateComponent,
    MyQuestionsComponent,
    InviteFriendsComponent,
    QuestionAddUpdateComponent,
    InviteFriendsDialogComponent
  ],
  imports: [
    // rwa modules
    SharedModule,
    NativeScriptRouterModule,
    UserRoutingModule,
    NativeScriptUIListViewModule,
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
    InviteFriendsComponent,
  ]
})
export class UserModule { }
