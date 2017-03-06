import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule }     from '@angular/forms';

import 'hammerjs';
import { MaterialModule } from '@angular/material';
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
    MaterialModule,
    //Flex
    FlexLayoutModule

  ],
  providers: [ 
  ],                                                                      
  exports:  [ QuestionsComponent,
              CommonModule, ReactiveFormsModule,
              MaterialModule, FlexLayoutModule ]
})
export class SharedModule { }
