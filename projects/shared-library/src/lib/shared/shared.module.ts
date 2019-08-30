import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CdkTableModule } from '@angular/cdk/table';
import { SharedMaterialModule } from './shared-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { ShareButtonModule } from '@ngx-share/button';
import { SafeHtmlPipe } from './pipe/safe-html.pipe';
import { ImageCropperModule } from 'ngx-img-cropper';

import {
  QuestionsSearchComponent, QuestionsTableComponent,
  QuestionFormComponent, RejectedQuestionContentComponent, SocialPaletteComponent, AuthorComponent, RenderQuestionComponent,
  RenderAnswerComponent, CropImageDialogComponent, UserCardComponent, InviteMailFriendsComponent, UserReactionComponent,
  CheckDisplayNameComponent, FriendInviteComponent, GameInviteComponent
} from './components';
import { ShowHintWhenFocusOutDirective, OpenUserProfileDirective } from './directive';
import { NgQuillTexModule } from 'ng-quill-tex';
@NgModule({
  declarations: [
    QuestionsSearchComponent,
    QuestionsTableComponent,
    QuestionFormComponent,
    RejectedQuestionContentComponent,
    SocialPaletteComponent,
    AuthorComponent,
    ShowHintWhenFocusOutDirective,
    OpenUserProfileDirective,
    SafeHtmlPipe,
    RenderQuestionComponent,
    RenderAnswerComponent,
    CropImageDialogComponent,
    UserCardComponent,
    InviteMailFriendsComponent,
    UserReactionComponent,
    CheckDisplayNameComponent
    FriendInviteComponent,
    GameInviteComponent
  ],
  imports: [
    CommonModule,

    // http client
    HttpClientModule,
    // Forms
    ReactiveFormsModule,
    // cdk
    CdkTableModule,
    // Material
    SharedMaterialModule,
    // Flex
    FlexLayoutModule,
    RouterModule,
    FormsModule,
    HttpClientModule,       // for share counts
    ShareButtonModule,
    NgQuillTexModule,
    ImageCropperModule
  ],
  exports: [QuestionsSearchComponent, QuestionsTableComponent, RenderAnswerComponent, CropImageDialogComponent,
    CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule,
    FlexLayoutModule, QuestionFormComponent,
    SharedMaterialModule, CdkTableModule, RejectedQuestionContentComponent,
    HttpClientModule, ShareButtonModule, SocialPaletteComponent, AuthorComponent, ShowHintWhenFocusOutDirective,
    OpenUserProfileDirective, SafeHtmlPipe, RenderQuestionComponent, UserCardComponent,
    ,UserReactionComponent, CheckDisplayNameComponent, FriendInviteComponent, GameInviteComponent, InviteMailFriendsComponent
  ],
  entryComponents: [CropImageDialogComponent]
})
export class SharedModule { }
