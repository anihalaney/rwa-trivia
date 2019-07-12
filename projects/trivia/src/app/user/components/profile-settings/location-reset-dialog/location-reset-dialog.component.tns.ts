import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
  selector: 'app-location-reset-dialog',
  templateUrl: './location-reset-dialog.component.html',
  styleUrls: ['./location-reset-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class LocationResetDialogComponent implements OnInit, OnDestroy {

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
