import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-location-reset-dialog',
  templateUrl: './location-reset-dialog.component.html',
  styleUrls: ['./location-reset-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class LocationResetDialogComponent {


  constructor(public dialogRef: MatDialogRef<LocationResetDialogComponent>) {
  }
  closeModel() {
    this.dialogRef.close();
  }
}
