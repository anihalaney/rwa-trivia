import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ActionBarComponent, DrawerComponent, QuestionsTableComponent } from './mobile/component';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { GameFilterPipe } from './pipe/game-filter.pipe';
import { TNSCheckBoxModule } from 'nativescript-checkbox/angular';
import { NativeScriptUIAutoCompleteTextViewModule } from 'nativescript-ui-autocomplete/angular';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';

@NgModule({
  declarations: [
    ActionBarComponent,
    DrawerComponent,
    QuestionsTableComponent,
    GameFilterPipe
  ],
  imports: [
    CommonModule,

    // http client
    HttpClientModule,
    // Forms
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,       // for share counts
    NativeScriptCommonModule,

    NativeScriptFormsModule,
    ReactiveFormsModule,
    TNSCheckBoxModule,
    NativeScriptUIAutoCompleteTextViewModule,
    NativeScriptUIListViewModule
  ],
  exports: [
    CommonModule, HttpClientModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    TNSCheckBoxModule,
    NativeScriptCommonModule,
    NativeScriptUIAutoCompleteTextViewModule,
    NativeScriptUIListViewModule,
    HttpClientModule,
    ActionBarComponent,
    DrawerComponent,
    QuestionsTableComponent,
    GameFilterPipe],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule { }
