import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { WindowRef } from 'shared-library/core/services';
import { User } from 'shared-library/shared/model';

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
    this.hostname = `${windowRef.nativeWindow.location.protocol}//${windowRef.nativeWindow.location.hostname}`;
   // console.log('hostname---->', this.hostname);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
