import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { ShareButtons } from '@ngx-share/core';
import { faPinterest, faTwitterSquare, faFacebookSquare } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'social-palette',
  templateUrl: './social-palette.component.html',
  styleUrls: ['./social-palette.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialPaletteComponent implements OnChanges {
  @Input() blogId: number;
  @Input() blogData: any;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isFromBlog: boolean;
  blogUrl = undefined;

  constructor(public share: ShareButtons) {
  }

  closeSocial() {
    this.blogData.share_status = false;
    this.notify.emit(this.blogData);
  }
  ngOnChanges() {
    this.blogUrl = this.blogData.link;
  }

}
