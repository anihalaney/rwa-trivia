import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User, DashboardConstants } from '../../../../../shared-library/src/lib/shared/model';
import { WindowRef } from 'shared-library/src/lib/core/services';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  @Input() user: User;
  @Output() logoutClicked = new EventEmitter();
  @Output() loginClicked = new EventEmitter();
  hostname: string;

  constructor(private router: Router, private windowRef: WindowRef) {
    this.hostname = `${DashboardConstants.HTTPS_PROTOCOL}${windowRef.nativeWindow.location.hostname}`;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
