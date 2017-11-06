import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { AppStore } from '../../../core/store/app-store';
import { User } from '../../../model';

@Component({
  selector: 'profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent {
  @Input() user: User;
  sub: Subscription;
  
  constructor(private store: Store<AppStore>) {

  this.sub = store.select(s => s.user).subscribe(user => {
    this.user = user;
    });
  }
}
