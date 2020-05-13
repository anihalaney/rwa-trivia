import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState, appState } from '../../../store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class BlogComponent implements OnDestroy, AfterViewInit {
  @Input() blogId: number;
  blogData = [];

  subscriptions = [];
  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef) {
    this.subscriptions.push(this.store.select(appState.dashboardState).pipe(select(s => s.blogs)).subscribe(blogs => {
      this.blogData = blogs;
      this.cd.markForCheck();
    }));
  }

  onNotify(info: any) {
    this.blogData[this.blogData.findIndex(blog => blog.blogNo === info.blogNo)].share_status = info.share_status;
  }

  ngOnDestroy() {
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(this.store.select(appState.dashboardState).pipe(select(s => s.blogs)).subscribe(blogs => {
      this.blogData = blogs;
    }));
  }
}
