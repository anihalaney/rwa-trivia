import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnDestroy {
  @Input() blogId: number;
  sub: Subscription;
  blogData = [];

  constructor(private store: Store<AppState>, private utils: Utils) {
    this.sub = this.store.select(appState.socialState).pipe(select(s => s.blogs)).subscribe(blogs => {
      this.blogData = blogs;
    });
  }

  onNotify(info: any) {
    this.blogData[this.blogData.findIndex(blog => blog.blogNo === info.blogNo)].share_status = info.share_status;
  }

  ngOnDestroy() {
    this.utils.unsubscribe([this.sub]);
  }
}
