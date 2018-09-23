import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import * as bulkActions from '../../../bulk/store/actions';
import { bulkState } from '../../../bulk/store';
import { AppState, appState, categoryDictionary } from '../../../store';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-bulk',
  templateUrl: './bulk.component.html',
  styleUrls: ['./bulk.component.scss']
})
export class BulkComponent implements OnInit {

  public bulkSummaryDetailPath = 'admin/';
  public bulkSummaryTitle: string;
  public showSummaryTable = true;
  isArchive: boolean;
  isArchiveBtnClicked: boolean;
  toggleValue: boolean;


  constructor(private store: Store<AppState>) {
    this.store.select(bulkState).pipe(select(s => s.getArchiveToggleState)).subscribe((state) => {
      if (state != null) {
        this.toggleValue = state;
      } else {
        this.toggleValue = false;
      }
    });

    this.store.select(bulkState).pipe(select(s => s.getArchiveList)).subscribe((list) => {
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

  changeTableHeading(heading: string): void {
    if (heading) {
      this.bulkSummaryTitle = heading;
      this.showSummaryTable = false;
    }
  }

  setDefaultTitle(): void {
    this.bulkSummaryTitle = 'Bulk Upload Summary';
  }

  backToSummary(): void {
    this.showSummaryTable = true;
    this.setDefaultTitle();
  }

  tapped(value) {
    this.toggleValue = value;
    this.store.dispatch(new bulkActions.SaveArchiveToggleState({ toggle_state: this.toggleValue }));
  }
  archiveData() {
    this.isArchiveBtnClicked = true;
  }
}
