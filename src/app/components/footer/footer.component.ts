import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { User } from '../../model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  @Input() user: User;
  @Output() logoutClicked = new EventEmitter();
  @Output() loginClicked = new EventEmitter();
  blogUrl = 'https://bitwiser.io';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateUrl() {
    this.router.navigate(['my/questions']);
  }

  ngOnDestroy() {
  }
}
