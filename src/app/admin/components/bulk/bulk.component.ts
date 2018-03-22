import { Component , OnInit} from '@angular/core';


@Component({
  selector: 'app-bulk',
  templateUrl: './bulk.component.html',
  styleUrls: ['./bulk.component.scss']
})
export class BulkComponent implements OnInit {

  public bulkSummaryDetailPath = 'admin/';
  public bulkSummaryTitle: string;
  public showSummaryTable = true;


  constructor() { }

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
}
