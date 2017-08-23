import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule }     from '@angular/forms';
import { HttpClientModule }     from '@angular/common/http';
import { CdkTableModule }     from '@angular/cdk';

import { SharedMaterialModule } from './shared-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { QuestionsComponent, QuestionsTableComponent } from './components';

@NgModule({
  declarations: [
    QuestionsComponent,
    QuestionsTableComponent
  ],
  imports: [
    CommonModule,

    //http client
    HttpClientModule,

    // Forms
    ReactiveFormsModule, 

    //cdk
    CdkTableModule,

    //Material
    SharedMaterialModule,

    //Flex
    FlexLayoutModule

  ],
  providers: [ 
  ],                                                                      
  exports:  [ QuestionsComponent, QuestionsTableComponent,
              CommonModule, HttpClientModule, ReactiveFormsModule,
              FlexLayoutModule, 
              SharedMaterialModule, CdkTableModule ]
})
export class SharedModule { }
