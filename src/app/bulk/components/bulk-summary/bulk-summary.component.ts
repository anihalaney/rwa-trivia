import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bulk-summary',
  templateUrl: './bulk-summary.component.html',
  styleUrls: ['./bulk-summary.component.scss']
})
export class BulkSummaryComponent implements OnInit {
  private bulkSummaryDetailPath = '/';

  constructor() { }

  ngOnInit() {
  }

}
