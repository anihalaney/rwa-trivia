import { Component, Input } from '@angular/core';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  @Input() blogId: number;
  isSocial = false;

  getSocial() {
    this.isSocial = true;
  }

  onNotify(flag: boolean) {
    this.isSocial = flag;
  }
}
