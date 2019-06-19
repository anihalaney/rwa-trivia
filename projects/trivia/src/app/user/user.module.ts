import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from 'shared-library/shared/shared.module';
import { UserRoutingModule } from './routing/user-routing.module';

import { effects, reducer } from './store';

import {
  ProfileSettingsComponent,
  MyQuestionsComponent,
  QuestionAddUpdateComponent,
  InviteFriendsComponent,
  InviteFriendsDialogComponent,
  InviteMailFriendsComponent,
  LocactionResetDialogComponent
} from './components';
import { ImageCropperModule } from 'ngx-img-cropper';
@NgModule({
  declarations: [
    ProfileSettingsComponent,
    MyQuestionsComponent,
    QuestionAddUpdateComponent,
    InviteFriendsComponent,
    InviteFriendsDialogComponent,
    InviteMailFriendsComponent,
    InviteFriendsDialogComponent,
    LocactionResetDialogComponent
  ],
  imports: [
    // rwa modules
    SharedModule,
    UserRoutingModule,

    //ngrx feature store
    StoreModule.forFeature('user', reducer),

    //ngrx effects
    EffectsModule.forFeature(effects),

    ImageCropperModule,
  ],
  providers: [],
  exports: [
    ProfileSettingsComponent,
    MyQuestionsComponent,
    QuestionAddUpdateComponent,
    InviteFriendsComponent,
    InviteMailFriendsComponent,
    InviteFriendsDialogComponent,
    LocactionResetDialogComponent
  ],
  entryComponents: [
    InviteFriendsDialogComponent,
    LocactionResetDialogComponent
  ]
})
export class UserModule { }
