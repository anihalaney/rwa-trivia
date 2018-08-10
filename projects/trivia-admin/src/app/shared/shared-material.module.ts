import { NgModule } from '@angular/core';
import 'hammerjs';
import {
  MatInputModule, MatButtonModule, MatButtonToggleModule,
  MatCheckboxModule, MatRadioModule,
  MatSelectModule, MatAutocompleteModule,
  MatCardModule, MatListModule, MatTabsModule,
  MatMenuModule, MatSidenavModule, MatToolbarModule,
  MatIconModule, MatChipsModule,
  MatDialogModule, MatSnackBarModule,
  MatTableModule, MatPaginatorModule, MatSortModule,
  MatStepperModule, MatExpansionModule
} from '@angular/material';

@NgModule({
  imports: [
    //Material
    MatInputModule, MatButtonModule, MatButtonToggleModule,
    MatCheckboxModule, MatRadioModule,
    MatSelectModule, MatAutocompleteModule,
    MatCardModule, MatListModule, MatTabsModule,
    MatMenuModule, MatSidenavModule, MatToolbarModule,
    MatIconModule, MatChipsModule,
    MatDialogModule, MatSnackBarModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatStepperModule, MatExpansionModule
  ],
  exports: [MatInputModule, MatButtonModule, MatButtonToggleModule,
    MatCheckboxModule, MatRadioModule,
    MatSelectModule, MatAutocompleteModule,
    MatCardModule, MatListModule, MatTabsModule,
    MatMenuModule, MatSidenavModule, MatToolbarModule,
    MatIconModule, MatChipsModule,
    MatDialogModule, MatSnackBarModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatStepperModule, MatExpansionModule]
})
export class SharedMaterialModule { }
