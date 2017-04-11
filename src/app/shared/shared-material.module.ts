import { NgModule } from '@angular/core';
import 'hammerjs';
import { MdInputModule, MdButtonModule, MdCheckboxModule, MdSelectModule, 
         MdCardModule, MdListModule, MdTabsModule,
         MdMenuModule, MdSidenavModule, MdToolbarModule,
         MdIconModule, MdChipsModule,
         MdDialogModule, MdSnackBarModule } from '@angular/material';

@NgModule({
  imports: [
    //Material
    MdInputModule, MdButtonModule, MdCheckboxModule, MdSelectModule, 
    MdCardModule, MdListModule, MdTabsModule,
    MdMenuModule, MdSidenavModule, MdToolbarModule,
    MdIconModule, MdChipsModule,
    MdDialogModule, MdSnackBarModule
  ],
  exports:  [ MdInputModule, MdButtonModule, MdCheckboxModule, MdSelectModule, 
              MdCardModule, MdListModule, MdTabsModule,
              MdMenuModule, MdSidenavModule, MdToolbarModule,
              MdIconModule, MdChipsModule,
              MdDialogModule, MdSnackBarModule ]
})
export class SharedMaterialModule { }
