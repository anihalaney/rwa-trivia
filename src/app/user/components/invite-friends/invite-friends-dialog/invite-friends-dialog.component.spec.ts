import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteFriendsDialogComponent } from './invite-friends-dialog.component';

describe('InviteFriendsDialogComponent', () => {
  let component: InviteFriendsDialogComponent;
  let fixture: ComponentFixture<InviteFriendsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteFriendsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteFriendsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
