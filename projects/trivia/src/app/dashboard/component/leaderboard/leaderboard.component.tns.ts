import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Utils } from 'shared-library/core/services';
import { UserActions } from 'shared-library/core/store/actions';
import { Page } from 'tns-core-modules/ui/page';
// import { AppState } from '../../../store';
import { Leaderboard } from './leaderboard';
import { SelectedIndexChangedEventData } from 'nativescript-drop-down';
import { ValueList } from 'nativescript-drop-down';
import { AppState, appState } from '../../../store';
import { User } from 'shared-library/shared/model';
@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LeaderboardComponent extends Leaderboard implements OnDestroy {


  // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;
  public selectedIndex = 0;
  public categoryItem: ValueList<string>;
  public items: Array<string>;
  filterTopList = ['Top 10', 'Top 20', 'Top 30'];
  selectedTopFilter = 0;

  constructor(protected store: Store<AppState>,
    protected userActions: UserActions,
    protected utils: Utils,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
    private page: Page,
    protected ngZone: NgZone) {

    super(store, userActions, utils, route, cd, ngZone);
    this.page.on('loaded', () => this.ngZone.run(() => {
      this.renderView = true;
      this.cd.markForCheck();
    }));

    this.items = [];
    this.categoryDictList.map((category, index) => {
      this.items.push(category.categoryName);
    });
    this.cd.markForCheck();
  }

  public onchange(args: SelectedIndexChangedEventData) {
    this.selectedCatList = this.leaderBoardStatDict[(args.newIndex + 1)];
    this.cd.markForCheck();

  }

  public onTopFilterChanged(args: SelectedIndexChangedEventData) {
    this.selectedTopFilter = args.newIndex;
    this.cd.markForCheck();
  }


  get pagination() {
    return (this.selectedTopFilter + 1) * 10;
  }

  ngOnDestroy() {
    this.page.off('loaded');
    this.renderView = false;
  }



}
