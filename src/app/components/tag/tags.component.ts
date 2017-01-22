import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {TagService} from '../../services'
@Component({
  selector: 'tag-list',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, OnDestroy {
  tags: string[];
  sub: any;

  constructor(private tagService: TagService) {
  }

  ngOnInit() {
    this.sub = this.tagService.getTags()
                   .subscribe(tags => this.tags = tags);
  }

  ngOnDestroy() {
    if (this.sub)
      this.sub.unsubscribe();
  }

}
