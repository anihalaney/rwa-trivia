import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CdkTableModule } from '@angular/cdk/table';

import { SharedMaterialModule } from './shared-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import {
  QuestionComponent, QuestionsComponent, QuestionsSearchComponent, QuestionsTableComponent,
  BulkSummaryTableComponent, BulkSummaryQuestionComponent, QuestionFormComponent
} from './components';

@NgModule({
  declarations: [
    QuestionComponent,
    QuestionsComponent,
    QuestionsSearchComponent,
    QuestionsTableComponent,
    BulkSummaryTableComponent,
    BulkSummaryQuestionComponent,
    QuestionFormComponent
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
    RouterModule

  ],
  providers: [
  ],
  exports: [QuestionComponent, QuestionsComponent, QuestionsSearchComponent, QuestionsTableComponent,
    BulkSummaryTableComponent, BulkSummaryQuestionComponent, CommonModule, HttpClientModule, ReactiveFormsModule,
    FlexLayoutModule, QuestionFormComponent,
    SharedMaterialModule, CdkTableModule]
})
export class SharedModule { }
