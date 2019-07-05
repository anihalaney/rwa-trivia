import {
  Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit,
  SimpleChanges, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { GameQuestion } from './game-question';
@Component({
  selector: 'game-question',
  templateUrl: './game-question.component.html',
  styleUrls: ['./game-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameQuestionComponent extends GameQuestion implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  @ViewChild('overlay') overlay: ElementRef;
  @ViewChild('loader') loader: ElementRef;
  alpha = 0;
  setTimeOutLimit = 0;

  constructor(private cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.cd.markForCheck();
  }

  ngOnDestroy() {
  }

  ngAfterViewInit() {
    this.setTimeOutLimit = Math.floor((this.MAX_TIME_IN_SECONDS / 360) * 1000);
    const loader = this.loader.nativeElement, α = 0;
    this.draw(this.alpha, this.doPlay, loader);
  }

  draw(α, doPlay, loader) {
    α++;
    α %= 360;
    let r = (α * Math.PI / 180)
      , x = Math.sin(r) * 125
      , y = Math.cos(r) * -125
      , mid = (α > 180) ? 1 : 1
      , anim = 'M 1 1 v -125 A 125 125 1 '
        + mid + ' 1 '
        + x + ' '
        + y + ' z';

    if (this.doPlay) {
      loader.setAttribute('d', anim);
      setTimeout(() => {
        this.draw(α, this.doPlay, loader);
      }, this.setTimeOutLimit); // Redraw
    }
  }

  fillTimer() {
    this.loader.nativeElement.setAttribute('d', 'M 1 1 v -125 A 125 125 1 1 1 0 -125 z');
    this.cd.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.timer && changes.timer.firstChange) {
      const elapsedTime = this.MAX_TIME_IN_SECONDS - changes.timer.currentValue;
      this.alpha = (360 * elapsedTime) / this.MAX_TIME_IN_SECONDS;
    }
  }
}
