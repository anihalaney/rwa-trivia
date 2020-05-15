import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { GameProfileComponent } from './game-profile.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Utils } from 'shared-library/core/services';
import { User } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { testData } from 'test/data';
import { CoreState } from 'shared-library/core/store';
import { MatSnackBarModule } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { UserActions } from 'shared-library/core/store';
import { CONFIG } from 'shared-library/environments/environment';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

describe('GameProfileComponent', () => {

    let component: GameProfileComponent;
    let fixture: ComponentFixture<GameProfileComponent>;
    let spy: any;
    let user: User;
    let mockStore: MockStore<AppState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameProfileComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: Utils,
                    useValue: {
                        getImageUrl(user: User, width: Number, height: Number, size: string) {
                            if (user && user !== null && user.profilePicture && user.profilePicture !== '') {
                                if (this.sanitizer) {
                                    return this.sanitizer.bypassSecurityTrustUrl(
                                        `${CONFIG.functionsUrl}/user/profile/${user.userId}/${user.profilePicture}/${width}/${height}`
                                    );
                                } else {
                                    return `${CONFIG.functionsUrl}/user/profile/${user.userId}/${user.profilePicture}/${width}/${height}`;
                                }
                            } else {
                                if (isPlatformBrowser(this.platformId) === false && isPlatformServer(this.platformId) === false) {
                                    return `~/assets/images/avatar-${size}.png`;
                                } else {
                                    return `assets/images/avatar-${size}.png`;
                                }
                            }
                        }
                    }
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({ userid: 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1' })
                    }
                },
                {
                    provide: Router
                },
                UserActions,
                provideMockStore({
                    selectors: [
                        {
                            selector: appState.coreState,
                            value: {}
                        }
                    ]
                })
            ],
            imports: [MatSnackBarModule]
        });

    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(GameProfileComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');

        component = fixture.debugElement.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('User should be undefined when component is created', () => {
        expect(component.user).toBe(undefined);
    });

    it('Verify sendFriendRequest function works', () => {
        component.user = { ...testData.userList[0] };
        component.loggedInUser = { ...testData.userList[1] };
        component.sendFriendRequest();
        expect(spy).toHaveBeenCalled();
    });

    it('Verify getImageUrl function works', () => {
        user = { ...testData.userList[0] };
        component.categoryDictionary = testData.categoryDictionary;
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
        });
        mockStore.refreshState();
        fixture.detectChanges();
        const expectedURL = '~/assets/images/avatar-400X400.png';
        expect(component.getImageUrl(user)).toEqual(expectedURL);
    });

    it('Verify topicsArray for diffrent user login profile', () => {
        user = { ...testData.userList[0] };
        component.categoryDictionary = testData.categoryDictionary;
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
        });
        mockStore.refreshState();
        fixture.detectChanges();
        const expectedTopics = {
            userTopics: user && user.tags && user.tags.length > 0 ? [...user.tags, ...user.categoryIds] : []
        };
        expect(component.topicsArray.userTopics).toEqual(expectedTopics.userTopics);
    });

    it('Verify topicsArray for same user login profile', () => {
        user = { ...testData.userList[1] };
        component.categoryDictionary = testData.categoryDictionary;
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
        });
        mockStore.refreshState();
        fixture.detectChanges();
        const expectedTopics = {
            userTopics: user && user.tags && user.tags.length > 0 ? [...user.tags, ...user.categoryIds] : []
        };
        expect(component.topicsArray.userTopics).toEqual(expectedTopics.userTopics);
    });

    it('Verify tagsArray for diffrent user login profile', () => {
        user = { ...testData.userList[0] };
        component.categoryDictionary = testData.categoryDictionary;
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
        });
        mockStore.refreshState();
        fixture.detectChanges();
        const expectedTopics = {
            userTags: user && user.tags && user.tags.length > 0 ? user.tags : undefined
        };
        expect(component.tagsArray.userTags).toEqual(expectedTopics.userTags);
    });

    it('Verify tagsArray for same user login profile', () => {
        user = { ...testData.userList[1] };
        component.categoryDictionary = testData.categoryDictionary;
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
        });
        mockStore.refreshState();
        fixture.detectChanges();
        const expectedTopics = {
            userTags: user && user.tags && user.tags.length > 0 ? user.tags : undefined
        };
        expect(component.tagsArray.userTags).toEqual(expectedTopics.userTags);
    });

    it('Verify topics for diffrent user login profile', () => {
        user = { ...testData.userList[0] };
        component.categoryDictionary = testData.categoryDictionary;
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
        });
        mockStore.refreshState();
        fixture.detectChanges();
        // Create expected result variable
        let expectedUserTopics: any[];
        // Check it user have tags
        if (user && user.tags && user.tags.length > 0) {
            expectedUserTopics = [...user.tags];
        }
        // Check if user have category
        if (user && user.categoryIds) {
            expectedUserTopics = [...user.tags, user.categoryIds.map((data) => component.categoryDictionary[data].categoryName)];
        } else {
            expectedUserTopics = [];
        }
        expect(component.topics).toEqual(expectedUserTopics);
    });

    it('Verify topics for same user login profile', () => {
        user = { ...testData.userList[1] };
        component.categoryDictionary = testData.categoryDictionary;
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
        });
        mockStore.refreshState();
        fixture.detectChanges();
        // Create expected result variable
        let expectedUserTopics: any[];
        // Check it user have tags
        if (user && user.tags && user.tags.length > 0) {
            expectedUserTopics = [...user.tags];
        }
        // Check if user have category
        if (user && user.categoryIds) {
            expectedUserTopics = [...user.tags, user.categoryIds.map((data) => component.categoryDictionary[data].categoryName)];
        } else {
            expectedUserTopics = [];
        }
        expect(component.topics).toEqual(expectedUserTopics);
    });

    it('Verify applicationSetting for user', () => {
        user = { ...testData.userList[0] };
        const applicationSetting: any[] = [];
        applicationSetting.push(testData.applicationSettings);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            applicationSettings: applicationSetting
        });
        component.initializeSocialSetting().subscribe();
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.applicationSettings).toEqual(applicationSetting[0]);
    });

    afterEach(() => {
        fixture.destroy();
    });

});
