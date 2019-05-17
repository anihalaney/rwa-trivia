import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from 'shared-library/shared/shared.module';
import { UserRoutingModule } from './routing/user-routing.module';
import { QuillModule } from 'ngx-quill';
import { effects, reducer } from './store';
import { QuillInitializeService } from 'shared-library/core/services/quillInitialize.service';
import { FormsModule } from '@angular/forms';
import {
  ProfileSettingsComponent,
  MyQuestionsComponent,
  QuestionAddUpdateComponent,
  InviteFriendsComponent,
  InviteFriendsDialogComponent,
  InviteMailFriendsComponent,
  CropImageDialogComponent
} from './components';
import { ImageCropperModule } from 'ngx-img-cropper';


import { TriviaQuillEditorComponent } from './../../../../trivia-editior/src/lib/trivia-quill-editor/trivia-quill-editor.component';


@NgModule({
  declarations: [
    ProfileSettingsComponent,
    MyQuestionsComponent,
    QuestionAddUpdateComponent,
    InviteFriendsComponent,
    InviteFriendsDialogComponent,
    InviteMailFriendsComponent,
    InviteFriendsDialogComponent,
    CropImageDialogComponent,
    TriviaQuillEditorComponent
  ],
  imports: [
    // rwa modules
    SharedModule,
    UserRoutingModule,
    QuillModule.forRoot(),
    //ngrx feature store
    StoreModule.forFeature('user', reducer),

    //ngrx effects
    EffectsModule.forFeature(effects),

    ImageCropperModule,
    FormsModule
  ],
  providers: [QuillInitializeService],
  exports: [
    ProfileSettingsComponent,
    MyQuestionsComponent,
    QuestionAddUpdateComponent,
    InviteFriendsComponent,
    InviteMailFriendsComponent,
    InviteFriendsDialogComponent,
    CropImageDialogComponent
  ],
  entryComponents: [
    InviteFriendsDialogComponent,
    CropImageDialogComponent
  ]
})
export class UserModule { }
