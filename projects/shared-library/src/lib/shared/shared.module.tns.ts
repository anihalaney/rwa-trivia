import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ActionBarComponent, DrawerComponent } from './mobile/component';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { GameFilterPipe } from './pipe/game-filter.pipe';

@NgModule({
  declarations: [
    ActionBarComponent,
    DrawerComponent,
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
    NativeScriptCommonModule
  ],
  exports: [
    CommonModule, HttpClientModule, ReactiveFormsModule,
    HttpClientModule,
    ActionBarComponent,
    DrawerComponent,
    GameFilterPipe]
})
export class SharedModule { }
