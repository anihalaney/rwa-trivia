import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { AppState, appState } from '../../../store';
import { Utils } from '../../../core/services';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnDestroy {
  @Input() blogId: number;
  sub: Subscription;
  blogData = [];

  constructor(private store: Store<AppState>) {
    this.sub = this.store.select(appState.socialState).select(s => s.blogs).subscribe(blogs => {
      if (blogs.length > 0) {
        this.blogData = blogs;
      }
    });
  }

  onNotify(info: any) {
    this.blogData[this.blogData.findIndex(blog => blog.blogNo === info.blogNo)].share_status = info.share_status;
  }

  ngOnDestroy() {
    Utils.unsubscribe([this.sub]);
  }
}
