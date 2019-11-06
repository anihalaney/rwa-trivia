import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Utils } from 'shared-library/core/services';
import { UserActions } from 'shared-library/core/store/actions';
import { Page } from 'tns-core-modules/ui/page';
// import { AppState } from '../../../store';
import { Leaderboard } from './leaderboard';
import { SelectedIndexChangedEventData, DropDown } from 'nativescript-drop-down';
import { ValueList } from 'nativescript-drop-down';
import { AppState, appState } from '../../../store';
import { User } from 'shared-library/shared/model';
import { RadListViewComponent } from "nativescript-ui-listview/angular";
@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LeaderboardComponent extends Leaderboard implements OnDestroy, OnInit {
  @ViewChild('dropdown', { static: false }) dropdown: ElementRef;
  @ViewChild('dropdowntop', { static: false }) dropdownTop: ElementRef;
  // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;
  public selectedIndex = 0;
  public categoryItem: ValueList<string>;
  public items: Array<string>;
  filterTopList = ['Top 10', 'Top 20', 'Top 30'];
  selectedTopFilter = 0;
  private _paginationFunc: (item: any) => any;
  @ViewChild("radListView", { read: RadListViewComponent, static: false }) radListView: RadListViewComponent;
  constructor(protected store: Store<AppState>,
    protected userActions: UserActions,
    protected utils: Utils,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
    private page: Page,
    protected ngZone: NgZone) {

    super(store, userActions, utils, route, cd, ngZone);
    this.items = [];
    this.categoryDictList.map((category, index) => {
      this.items.push(category.categoryName);
    });
    this.cd.markForCheck();

    this.paginationFunc = (item: any) => {
      return (item &&  item.index < this.pagination ) ? true : false;
    };
  }

  get paginationFunc(): (item: any) => any {
    return this._paginationFunc;
  }

  set paginationFunc(value: (item: any) => any) {
      this._paginationFunc = value;
  }


  public applyPagination() {
    const listView = this.radListView.listView;
    listView.filteringFunction = undefined;
    listView.filteringFunction = this.paginationFunc;
  }

  openDropdown() {
    const dropdown = <DropDown>this.dropdown.nativeElement;
    dropdown.open();
  }

  ngOnInit() {
    this.page.on('loaded', () => { this.renderView = true; this.cd.markForCheck(); });
  }

  onchange(args: SelectedIndexChangedEventData) {
    this.selectedCatList = this.leaderBoardStatDict[(args.newIndex + 1)];
    this.selectedCatList.map((data, index) => {
      data.index = index;
    });
    this.applyPagination();
    this.cd.markForCheck();

  }

  openDropdowntop() {
    const dropdownTop = <DropDown>this.dropdownTop.nativeElement;
    dropdownTop.open();
  }

  onTopFilterChanged(args: SelectedIndexChangedEventData) {
    this.selectedTopFilter = args.newIndex;
    this.applyPagination();
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
