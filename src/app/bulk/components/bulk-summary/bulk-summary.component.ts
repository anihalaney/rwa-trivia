import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { OnInit, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Input } from '@angular/core/src/metadata/directives';

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


  constructor() { }

  ngOnInit() {
    this.setDefaultTitle();
  }

  ngOnChanges() {

  }

  tapped(value) {
    this.toggleValue = value;
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
  showArchiveBtn(value: boolean) {
    this.isArchive = value;
  }
  archiveData() {
    this.isArchiveBtnClicked = true;
  }


}
