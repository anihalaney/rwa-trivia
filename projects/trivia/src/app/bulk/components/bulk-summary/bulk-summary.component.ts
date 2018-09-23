import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import * as bulkActions from '../../store/actions';
import { bulkState } from '../../store';
import { Utils } from '../../../../../../shared-library/src/lib/core/services';

@Component({
  selector: 'app-bulk-summary',
  templateUrl: './bulk-summary.component.html',
  styleUrls: ['./bulk-summary.component.scss']
})
export class BulkSummaryComponent implements OnInit, OnChanges, OnDestroy {

  public bulkSummaryDetailPath = '/';
  public bulkSummaryTitle: string;
  public showSummaryTable = true;
  isArchive: boolean;
  isArchiveBtnClicked: boolean;
  toggleValue: boolean;
  subs: Subscription[] = [];


  constructor(private store: Store<AppState>, ) {
    this.subs.push(this.store.select(bulkState).pipe(select(s => s.getArchiveToggleState)).subscribe((state) => {
      if (state != null) {
        this.toggleValue = state;
      } else {
        this.toggleValue = false;
      }
    }));
    this.subs.push(this.store.select(bulkState).pipe(select(s => s.getArchiveList)).subscribe((list) => {
      if (list.length > 0) {
        this.isArchive = true;
      } else {
        this.isArchive = false;
        this.isArchiveBtnClicked = false;

      }
    }));
  }

  ngOnInit() {
    this.setDefaultTitle();
  }

  ngOnChanges() {

  }

  tapped(value) {
    this.toggleValue = value;
    this.store.dispatch(new bulkActions.SaveArchiveToggleState({ toggle_state: this.toggleValue }));
  }

  changeTableHeading(heading: string): void {
    if (heading) {
      this.bulkSummaryTitle = heading;
      this.showSummaryTable = false;
    }
  }

  setDefaultTitle(): void {
    this.bulkSummaryTitle = 'My Bulk Upload Summary';
  }

  backToSummary(): void {
    this.showSummaryTable = true;
    this.setDefaultTitle();
  }
  archiveData() {
    this.isArchiveBtnClicked = true;
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }

}
