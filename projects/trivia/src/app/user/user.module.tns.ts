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
  InviteMailFriendsComponent,
  LocactionResetDialogComponent
} from './components';

@NgModule({
  declarations: [
    ProfileSettingsComponent,
    QuestionAddUpdateComponent,
    MyQuestionsComponent,
    InviteFriendsComponent,
    QuestionAddUpdateComponent,
    InviteFriendsDialogComponent,
    InviteMailFriendsComponent,
    LocactionResetDialogComponent
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
    InviteFriendsComponent,
    LocactionResetDialogComponent
  ],
  entryComponents: [
    LocactionResetDialogComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class UserModule { }
