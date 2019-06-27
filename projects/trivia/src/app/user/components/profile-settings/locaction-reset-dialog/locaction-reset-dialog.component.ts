import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-locaction-reset-dialog',
  templateUrl: './locaction-reset-dialog.component.html',
  styleUrls: ['./locaction-reset-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class LocactionResetDialogComponent {


  constructor(private dialogRef: MatDialogRef<LocactionResetDialogComponent>) {
  }
  closeModel() {
    this.dialogRef.close();
  }
}
