import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCardComponent } from './game-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { select, Store, StoreModule, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { UserActions } from 'shared-library/core/store/actions/user.actions';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Utils } from 'shared-library/core/services';
import {
    User, Game, Category, PlayerMode, GameStatus, CalenderConstants, userCardType,
    ApplicationSettings
} from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { TEST_DATA } from 'shared-library/testing/test.data';

import { cold } from 'jasmine-marbles';
import { CoreState } from 'shared-library/core/store';
import { delay } from 'rxjs/operators';

class RouterStub {
    navigateByUrl(url: string) { return url; }
}

class UserActionStub {

}

describe('GameCardComponent', () => {
    const initialState = {
        user: {"androidPushTokens":[{"online":false,"token":"ct7vhZOa__U:APA91bFCVEncCZg__c0P8kZo2k0WfCB_nVUds4sViaQiyPmUX7VUf29vfKUEQ4jRQ5BRq9BMRNdZDrVIVgMH-fGB6f1AEXXca4TAjPOGoaFVjKMA7952BMuaLy4-Z9-y0EC76abGDPsJ"}],"authState":{"uid":"4kFa6HRvP5OhvYXsH9mEsRrXj4o2","displayName":null,"photoURL":null,"email":"priyankamavani99+124@gmail.com","emailVerified":false,"phoneNumber":null,"isAnonymous":false,"providerData":[{"uid":"priyankamavani99+124@gmail.com","displayName":null,"photoURL":null,"email":"priyankamavani99+124@gmail.com","phoneNumber":null,"providerId":"password"}],"apiKey":"AIzaSyAqSJgn64UBZUbc7p7UDKSLOoburAENGDw","appName":"[DEFAULT]","authDomain":"rwa-trivia-dev-e57fc.firebaseapp.com","stsTokenManager":{"apiKey":"AIzaSyAqSJgn64UBZUbc7p7UDKSLOoburAENGDw","refreshToken":"AE0u-Ne0XenRT6S9lZibvWOE3jmuTda9JdJ01W_81PbTAgPRlMYlHr25B1qMqV_5KWKLWLFvE-mQP5g-0z5Gn753k7Hb26jkbFWy5XjwY4wlp2Bf7Dny0MmdwosbCG_7423LxA6BFj6bYb6zF-TePSavH-6XHKhyXyYm6oyvfaTn0VRtlhHG2k_lnmn4ktieo0AwCyrqFsGkUt9qyU6qTFh1ybtsgr2BOPKAaewRmi9SmDeshHd2UcY","accessToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjVlOWVlOTdjODQwZjk3ZTAyNTM2ODhhM2I3ZTk0NDczZTUyOGE3YjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcndhLXRyaXZpYS1kZXYtZTU3ZmMiLCJhdWQiOiJyd2EtdHJpdmlhLWRldi1lNTdmYyIsImF1dGhfdGltZSI6MTU4NzEyMTIwNiwidXNlcl9pZCI6IjRrRmE2SFJ2UDVPaHZZWHNIOW1Fc1JyWGo0bzIiLCJzdWIiOiI0a0ZhNkhSdlA1T2h2WVhzSDltRXNSclhqNG8yIiwiaWF0IjoxNTg4MTUzMjg2LCJleHAiOjE1ODgxNTY4ODYsImVtYWlsIjoicHJpeWFua2FtYXZhbmk5OSsxMjRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInByaXlhbmthbWF2YW5pOTkrMTI0QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.dYU7jHXMZX7dGFuvm-y7Um_GMfbkhZUcTdtr_tiTfARxpUMxgxXZyZ_vQr_qIxmnoSOZ0SnSsYPHPj5qH_aWGyUhfQkXGMcawSCLOeHrs0u0Vv6P4vyoD71m2V_5SB1ikm16tYNzZzgM91XKHJ22w2r-36-_z-eKnvQ97iyferCIAgHZXUVKkWpOizSpdy6zFYrfTwaky59NR2s1Ekoz2teRHd6xb5L2SgMy9WNQut_YTtym1SrwK_a0dj9Xkq7PBWXgWeIC4W7-uBJCa5-lC2zU5FFNCzlPl6Oe7GrUFyAd431RfUw0wJRxQkwsQ0-aGwy53xhhgU7cTl8HSdGpGQ","expirationTime":1588156880113},"redirectEventId":null,"lastLoginAt":"1587463641083","createdAt":"1584438276097"},"captured":"web","categoryIds":[2,8,3,4,5,9,7],"displayName":"Priyanka 124","email":"priyankamavani99+124@gmail.com","geoPoint":{"latitude":22.258651999999998,"longitude":71.1923805},"idToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjVlOWVlOTdjODQwZjk3ZTAyNTM2ODhhM2I3ZTk0NDczZTUyOGE3YjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcndhLXRyaXZpYS1kZXYtZTU3ZmMiLCJhdWQiOiJyd2EtdHJpdmlhLWRldi1lNTdmYyIsImF1dGhfdGltZSI6MTU4NzEyMTIwNiwidXNlcl9pZCI6IjRrRmE2SFJ2UDVPaHZZWHNIOW1Fc1JyWGo0bzIiLCJzdWIiOiI0a0ZhNkhSdlA1T2h2WVhzSDltRXNSclhqNG8yIiwiaWF0IjoxNTg4MTUzMjg2LCJleHAiOjE1ODgxNTY4ODYsImVtYWlsIjoicHJpeWFua2FtYXZhbmk5OSsxMjRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInByaXlhbmthbWF2YW5pOTkrMTI0QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.dYU7jHXMZX7dGFuvm-y7Um_GMfbkhZUcTdtr_tiTfARxpUMxgxXZyZ_vQr_qIxmnoSOZ0SnSsYPHPj5qH_aWGyUhfQkXGMcawSCLOeHrs0u0Vv6P4vyoD71m2V_5SB1ikm16tYNzZzgM91XKHJ22w2r-36-_z-eKnvQ97iyferCIAgHZXUVKkWpOizSpdy6zFYrfTwaky59NR2s1Ekoz2teRHd6xb5L2SgMy9WNQut_YTtym1SrwK_a0dj9Xkq7PBWXgWeIC4W7-uBJCa5-lC2zU5FFNCzlPl6Oe7GrUFyAd431RfUw0wJRxQkwsQ0-aGwy53xhhgU7cTl8HSdGpGQ","isAutoComplete":false,"isCategorySet":true,"lastGamePlayOption":{"categoryIds":[1,8,2,3,4,5,7,9],"friendId":"yP7sLu5TmYRUO9YT4tWrYLAqxSz1","gameMode":0,"isBadgeWithCategory":true,"isChallenge":false,"maxQuestions":8,"opponentType":1,"playerMode":1,"rematch":true,"tags":[]},"location":"Surendranagar,Gujarat","phoneNo":null,"profilePictureUrl":"/assets/images/default-avatar-small.png","tags":[],"totalFriends":0,"userId":"4kFa6HRvP5OhvYXsH9mEsRrXj4o2"}
     };
    let component: GameCardComponent;
    let fixture: ComponentFixture<GameCardComponent>;
    let _store: any;
    let spy: any;
    let user: any;
    let mockStore: MockStore<AppState>;
    let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameCardComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: Utils, useValue: { getImageUrl(user) { return user.profilePicture}} },
                provideMockStore( {
                    selectors: [
                      {
                        selector: appState.coreState,
                        value: {
                          user: null,
                          userDict: null
                        }
                      }
                    ]
                  })
            ]
        });

    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(GameCardComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');

        component = fixture.debugElement.componentInstance;

        // init data
        _store = fixture.debugElement.injector.get(Store);
        const dbModel = TEST_DATA.game[0];
        component.game = new Game(dbModel['gameOptions'], dbModel['playerIds'][0], dbModel['id'],
            dbModel['playerQnAs'], dbModel['gameOver'], dbModel['nextTurnPlayerId'],
            (dbModel['playerIds'].length > 1) ? dbModel['playerIds'][1] : undefined, dbModel['winnerPlayerId'],
            dbModel['GameStatus'], dbModel['createdAt'], dbModel['turnAt'], dbModel['gameOverAt'],
            dbModel['round'], dbModel['reminder32Min'], dbModel['reminder8Hr']);



        component.ngOnInit();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('verify capitalizeFirstLetter function', () => {
        const categoryName = 'infrastructure/networking';
        const categoryNameWithCapitalizedFirstLetter = component.capitalizeFirstLetter(categoryName);
        expect(categoryNameWithCapitalizedFirstLetter).toEqual('Infrastructure/networking');
    });

    it(`Initially user value should be undefined `, () => {
        expect(component.user).toBe(undefined);
    });

    it('verify getImageUrl function', () => {
        const user = { ...TEST_DATA.userList[0] };
        const imageUrl = component.getImageUrl(user);
        expect(imageUrl).toEqual('https://rwa-trivia-dev-e57fc.firebaseapp.com/v1/user/profile/yP7sLu5TmYRUO9YT4tWrYLAqxSz1/1588239971967-download.jpeg/263/263');
    });

    it('subscription for logged in user', () => {
        user = { ...TEST_DATA.userList[0] };
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
          });
          mockStore.refreshState();
          expect(component.user).toBe(user);
      });

      it('Verify updateRemainingTime function', () => {
        user = { ...TEST_DATA.userList[0] };
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
          });
          mockStore.refreshState();

          delay(1000);
          expect(component.user).toBe(user);
      });
});
