import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule }     from '@angular/forms';

import { SharedMaterialModule } from './shared-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { QuestionsComponent } from './components';

@NgModule({
  declarations: [
    QuestionsComponent
  ],
  imports: [
    CommonModule,

    // Forms
    ReactiveFormsModule, 

    //Material
    SharedMaterialModule,

    //Flex
    FlexLayoutModule

  ],
  providers: [ 
  ],                                                                      
  exports:  [ QuestionsComponent,
              CommonModule, ReactiveFormsModule,
              FlexLayoutModule, 
              SharedMaterialModule ]
})
export class SharedModule { }
