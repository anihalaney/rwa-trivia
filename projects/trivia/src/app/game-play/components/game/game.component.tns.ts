import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, NgZone, AfterContentInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { User } from 'shared-library/shared/model';
import { AppState } from '../../../store';
import { Game } from './game';
import { Page } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent extends Game implements OnInit, OnDestroy, AfterContentInit {
  user: User;
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};
  displayQuestion = false;
  // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;
  timeout: any;

  constructor(public store: Store<AppState>, public page: Page, private ngZone: NgZone) {
    super(store);
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    this.timeout = setTimeout(() => this.displayQuestion = true, 0);
    // update to variable needed to do in ngZone otherwise it did not understand it 

  }

  ngAfterContentInit() {
    this.page.on('loaded', () => this.ngZone.run(() => this.renderView = true));
  }

  ngOnDestroy() {
    this.page.off('loaded');
    this.renderView = false;
    clearTimeout(this.timeout);
  }
}
