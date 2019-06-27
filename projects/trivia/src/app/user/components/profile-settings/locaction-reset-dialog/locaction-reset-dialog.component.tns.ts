import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
  selector: 'app-locaction-reset-dialog',
  templateUrl: './locaction-reset-dialog.component.html',
  styleUrls: ['./locaction-reset-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class LocactionResetDialogComponent implements OnInit, OnDestroy {

  constructor(private params: ModalDialogParams) {
  }

  ngOnInit() {

  }

  onClose() {
    this.params.closeCallback();
  }

  ngOnDestroy() {

  }
}
