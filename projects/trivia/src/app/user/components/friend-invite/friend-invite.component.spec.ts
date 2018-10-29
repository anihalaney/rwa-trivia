import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendInviteComponent } from './friend-invite.component';

describe('FriendInviteComponent', () => {
  let component: FriendInviteComponent;
  let fixture: ComponentFixture<FriendInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
