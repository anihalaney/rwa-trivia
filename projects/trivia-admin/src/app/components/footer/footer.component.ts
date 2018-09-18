import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../../../shared-library/src/lib/shared/model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  @Input() user: User;
  @Output() logoutClicked = new EventEmitter();
  @Output() loginClicked = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
