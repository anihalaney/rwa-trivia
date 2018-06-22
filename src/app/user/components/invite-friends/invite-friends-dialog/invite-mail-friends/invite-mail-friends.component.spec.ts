import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteMailFriendsComponent } from './invite-mail-friends.component';

describe('InviteMailFriendsComponent', () => {
  let component: InviteMailFriendsComponent;
  let fixture: ComponentFixture<InviteMailFriendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteMailFriendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteMailFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
