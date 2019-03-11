import { Component, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState, appState } from '../../../store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})

@AutoUnsubscribe({ 'arrayName': 'subscription' })
export class BlogComponent implements OnDestroy, AfterViewInit {
  @Input() blogId: number;
  blogData = [];
  subscription = [];
  constructor(private store: Store<AppState>) {
    this.subscription.push(this.store.select(appState.socialState).pipe(select(s => s.blogs)).subscribe(blogs => {
      this.blogData = blogs;
    }));
  }

  onNotify(info: any) {
    this.blogData[this.blogData.findIndex(blog => blog.blogNo === info.blogNo)].share_status = info.share_status;
  }

  ngOnDestroy() {
  }

  ngAfterViewInit(): void {
    this.subscription.push(this.store.select(appState.socialState).pipe(select(s => s.blogs)).subscribe(blogs => {
      this.blogData = blogs;
    }));
  }
}
