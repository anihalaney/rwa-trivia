import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ShareButtons } from '@ngx-share/core';

@Component({
  selector: 'social-palette',
  templateUrl: './social-palette.component.html',
  styleUrls: ['./social-palette.component.scss']
})
export class SocialPaletteComponent implements OnChanges {
  @Input() blogId: number;
  @Input() blogData: any;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();
  blogUrl = undefined;

  constructor(public share: ShareButtons) {
  }

  closeSocial() {
    this.blogData.status = false;
    this.notify.emit(this.blogData);
  }
  ngOnChanges() {
    this.blogUrl = this.blogData.link;
  }

}
