import { Component, Input } from '@angular/core';

import { User } from '../../../model';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  @Input() user: User;
}
