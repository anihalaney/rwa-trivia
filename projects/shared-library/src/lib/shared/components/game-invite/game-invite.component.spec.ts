import { GameInviteComponent } from './game-invite.component';
import { Game } from 'shared-library/shared/model';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store, MemoizedSelector } from '@ngrx/store';
import { testData } from 'test/data';
import { CoreState, categoryDictionary } from 'shared-library/core/store';
import { coreState, UserActions, ActionWithPayload } from '../../../core/store';
import { Utils } from 'shared-library/core/services';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('GameInviteComponent', () => {
  let component: GameInviteComponent;
  let fixture: ComponentFixture<GameInviteComponent>;
  let spy: any;
  let mockStore: MockStore<CoreState>;
  let mockCategorySelector: MemoizedSelector<any, {}>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameInviteComponent],
      imports: [RouterTestingModule.withRoutes([])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: Utils, useValue: {
            getTimeDifference(pastTime: number, currentTime: number) {
              const diff = currentTime - pastTime;
              return diff;
            },
            getUTCTimeStamp() {
              return 1589378074;
            }

          }
        },
        provideMockStore({
          initialState: {},
          selectors: [
            {
              selector: coreState,
              value: {}
            },
            {
              selector: categoryDictionary,
              value: {}
            }
          ]
        }),
        UserActions
      ]
    });
  }));

  beforeEach(() => {
    // create component
    fixture = TestBed.createComponent(GameInviteComponent);
    // mock data
    mockStore = TestBed.get(Store);
    router = TestBed.get(Router);
    mockCategorySelector = mockStore.overrideSelector(categoryDictionary, {});
    spy = spyOn(mockStore, 'dispatch');

    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  // Check created component
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Category dictionary should be set when store emit Category dictionary', () => {
    const categoryDict = testData.categoryDictionary;
    mockCategorySelector.setResult(categoryDict);
    mockStore.refreshState();
    expect(component.categoryDict).toBe(categoryDict);
  });

  it('Call to acceptGameInvitation function it should navigate to game play', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.acceptGameInvitation(1);
    expect(navigateSpy).toHaveBeenCalledWith(['game-play', 1]);
  });



  it('call to rejectGameInvitation it should dispatch reject Game Invitation action', () => {

    const dbModel = testData.games[0];

    component.game = Game.getViewModel(dbModel);
    const gameId = testData.games[0].gameId;
    spy.and.callFake((action: ActionWithPayload<any>) => {
      expect(action.type).toEqual(UserActions.REJECT_GAME_INVITATION);
      expect(action.payload).toEqual(gameId);
    });

    component.rejectGameInvitation();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('call to ngOnChanges it should set gameStatus and remainingDays', () => {
    const dbModel = testData.games[1];
    component.game = Game.getViewModel(dbModel);
    component.ngOnChanges({
      game:
      {
        previousValue: undefined,
        currentValue: component.game,
        firstChange: true,
        isFirstChange: undefined
      }
    });
    expect(component.gameStatus).toBe('Friend');
    expect(component.remainingDays).toBe(8);
  });

  it('call to otherInfo function it should return category name, remainingDays and notificationText', () => {
    const dbModel = testData.games[1];
    component.categoryDict = testData.categoryDictionary;
    const game = Game.getViewModel(dbModel);
    component.game = game;
    component.ngOnChanges({
      game:
      {
        previousValue: undefined,
        currentValue: component.game,
        firstChange: true,
        isFirstChange: undefined
      }
    });

    component.randomCategoryId = 2;
    const otherInfo = component.otherInfo(game);
    expect(otherInfo).toEqual({
      category: 'Programming',
      remainingDays: 8,
      notificationText: 'sent you an invite to play game together'
    });
  });

  it('call to getCategoryName it should return category name with first character in uppercase', () => {
    const dbModel = testData.games[1];
    component.categoryDict = testData.categoryDictionary;
    const game = Game.getViewModel(dbModel);
    const randomCategoryId = 2;
    const categoryName = component.getCategoryName(game, randomCategoryId);

    expect(categoryName).toBe('Programming');
  });

});
