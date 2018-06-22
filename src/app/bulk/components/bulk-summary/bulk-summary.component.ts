import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { OnInit, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Input } from '@angular/core/src/metadata/directives';
import { AppState, appState, categoryDictionary } from '../../../store/app-store';
import * as bulkActions from '../../store/actions';
import { bulkState } from '../../store';

@Component({
  selector: 'app-bulk-summary',
  templateUrl: './bulk-summary.component.html',
  styleUrls: ['./bulk-summary.component.scss']
})
export class BulkSummaryComponent implements OnInit, OnChanges {

  public bulkSummaryDetailPath = '/';
  public bulkSummaryTitle: string;
  public showSummaryTable = true;
  isArchive: boolean;
  isArchiveBtnClicked: boolean;
  toggleValue: boolean;


  constructor(private store: Store<AppState>, ) {
    this.store.select(bulkState).select(s => s.getArchiveToggleState).subscribe((state) => {
      if (state != null) {
        this.toggleValue = state;
      } else {
        this.toggleValue = false;
      }
    });
    this.store.select(bulkState).select(s => s.getArchiveList).subscribe((list) => {
      if (list.length > 0) {
        this.isArchive = true;
      } else {
        this.isArchive = false;
        this.isArchiveBtnClicked = false;

      }
    });
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


}
