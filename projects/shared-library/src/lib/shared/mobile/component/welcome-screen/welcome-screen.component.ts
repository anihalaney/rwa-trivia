import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';
@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeScreenComponent {
  ref: any;
  constructor(private params: ModalDialogParams) {
   }

  closeModel() {
    this.params.closeCallback();

  }

}
