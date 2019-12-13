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
  InviteFriendsDialogComponent,
  LocationResetDialogComponent,
  PreviewQuestionDialogComponent,
  GameProfileComponent
} from './components';

import { ChangePasswordComponent } from 'shared-library/shared/mobile/component';


import { BulkUploadRequestComponent } from '../../../../shared-library/src/lib/shared/mobile/component';
import { DropDownModule } from 'nativescript-drop-down/angular';
@NgModule({
  declarations: [
    ProfileSettingsComponent,
    QuestionAddUpdateComponent,
    MyQuestionsComponent,
    InviteFriendsComponent,
    QuestionAddUpdateComponent,
    InviteFriendsDialogComponent,
    LocationResetDialogComponent,
    PreviewQuestionDialogComponent,
    GameProfileComponent,
    ChangePasswordComponent,
    BulkUploadRequestComponent
  ],
  imports: [
    // rwa modules
    SharedModule,
    NativeScriptRouterModule,
    UserRoutingModule,
    DropDownModule,

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
    LocationResetDialogComponent,
    GameProfileComponent,
    ChangePasswordComponent,
    BulkUploadRequestComponent
  ],
  entryComponents: [
    LocationResetDialogComponent,
    PreviewQuestionDialogComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class UserModule { }
