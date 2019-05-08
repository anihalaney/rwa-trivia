import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CdkTableModule } from '@angular/cdk/table';
import { SharedMaterialModule } from './shared-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { ShareButtonModule } from '@ngx-share/button';

import {
  QuestionsComponent, QuestionsSearchComponent, QuestionsTableComponent,
  QuestionFormComponent, RejectedQuestionContentComponent, SocialPaletteComponent, AuthorComponent
} from './components';
import { ShowHintWhenFocusOutDirective, OpenUserProfileDirective } from './directive';

@NgModule({
  declarations: [
    QuestionsComponent,
    QuestionsSearchComponent,
    QuestionsTableComponent,
    QuestionFormComponent,
    RejectedQuestionContentComponent,
    SocialPaletteComponent,
    AuthorComponent,
    ShowHintWhenFocusOutDirective,
    OpenUserProfileDirective
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

    HttpClientModule,       // for share counts
    ShareButtonModule
  ],
  exports: [QuestionsComponent, QuestionsSearchComponent, QuestionsTableComponent,
    CommonModule, HttpClientModule, ReactiveFormsModule,
    FlexLayoutModule, QuestionFormComponent,
    SharedMaterialModule, CdkTableModule, RejectedQuestionContentComponent,
    HttpClientModule, ShareButtonModule, SocialPaletteComponent, AuthorComponent, ShowHintWhenFocusOutDirective,
    OpenUserProfileDirective
  ]
})
export class SharedModule { }
