import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-game-progress-bar',
  templateUrl: './game-progress-bar.component.html',
  styleUrls: ['./game-progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameProgressBarComponent implements OnInit {
  @Input() questionRound: number;
  @Input() totalRound: number;
  gameProgress: string;

  constructor() {
    this.gameProgress = '';
  }

  ngOnInit() {
    if (this.questionRound && this.questionRound) {
      this.gameProgress = this.questionRound + '*,' + (this.totalRound - this.questionRound) + '*';
    }
  }

}
