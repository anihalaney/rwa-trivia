import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { ActionBarComponent, DrawerComponent } from './mobile/component'

@NgModule({
  declarations: [
    ActionBarComponent,
    DrawerComponent
  ],
  imports: [
    CommonModule,

    // http client
    HttpClientModule,
    // Forms
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,       // for share counts
    NativeScriptModule
  ],
  exports: [
    CommonModule, HttpClientModule, ReactiveFormsModule,
    HttpClientModule,
    ActionBarComponent,
    DrawerComponent]
})
export class SharedModule { }
