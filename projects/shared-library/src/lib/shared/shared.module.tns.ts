import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


// import {
//   AuthorComponent
// } from './components';


@NgModule({
  declarations: [
    // AuthorComponent
  ],
  imports: [
    CommonModule,

    // http client
    HttpClientModule,
    // Forms
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,       // for share counts
  ],
  exports: [
    CommonModule, HttpClientModule, ReactiveFormsModule,
    HttpClientModule]
})
export class SharedModule { }
