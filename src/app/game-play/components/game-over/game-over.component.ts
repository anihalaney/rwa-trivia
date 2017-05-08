import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent  {
  @Output() gameOverContinueClicked = new EventEmitter();

  continueButtonClicked() {
    this.gameOverContinueClicked.emit();
  }
}