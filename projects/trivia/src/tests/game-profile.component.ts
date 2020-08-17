import 'reflect-metadata';
import { GameProfileComponent } from '../app/user/components/game-profile/game-profile.component.tns';
import { Utils } from 'shared-library/core/services/utils';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as utils from 'tns-core-modules/utils/utils';
import { AppState, appState, categoryDictionary } from './../app/store';
import { UserActions } from 'shared-library/core/store/actions';
import { testData } from 'test/data';
import { CoreState } from 'shared-library/core/store';
import * as lodash from 'lodash';
import { User } from 'shared-library/shared/model';
import { of } from 'rxjs';

describe('GameProfileComponent', () => {

    let component: GameProfileComponent;
    let fixture: ComponentFixture<GameProfileComponent>;
    let mockStore: MockStore<AppState>;
    let spy: any;
    let router: Router;
    let user: User;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([GameProfileComponent], [
        UserActions,
        {
            provide: Utils,
            useValue: {
                getImageUrl(user: User, width: Number, height: Number, size: string) {
                    if (user && user !== null && user.profilePicture && user.profilePicture !== '') {
                        if (this.sanitizer) {
                            return this.sanitizer.bypassSecurityTrustUrl(
                                `https://rwa-trivia-dev-e57fc.firebaseapp.com/v1/user/profile/
                                ${user.userId}/${user.profilePicture}//${width}/${height}`
                            );
                        } else {
                            return `https://rwa-trivia-dev-e57fc.firebaseapp.com/v1/user/profile/
                            ${user.userId}/${user.profilePicture}//${width}/${height}`;
                        }
                    } else {
                        return `~/assets/images/avatar-${size}.png`;
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
        provideMockStore({
            selectors: [
                {
                    selector: appState.coreState,
                    value: {}
                }
            ]
        })
    ],
        [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]));


    beforeEach((async () => {
        fixture = await nsTestBedRender(GameProfileComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        router = TestBed.get(Router);
        // fixture.detectChanges();

    }));

    afterEach(nsTestBedAfterEach(true));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('it should get the icon', () => {
        const icon = 'f092';
        const iconString = component.getIcon(icon);
        expect(iconString).not.toBeNull();
    });

    it(`it should open Link`, () => {
        const spyUtils = spyOn(utils, 'openUrl').and.callThrough();
        component.openLink('https://www.google.com');
        expect(spyUtils).toHaveBeenCalled();
    });

    it(`it should update the categoryTag`, () => {
        const navigate = spyOn(component.router, 'navigate');
        component.updateCategoryTag();
        expect(navigate).toHaveBeenCalledWith(['/update-category-tag'], undefined);
    });
    it('On ngOnDestroy called  it should set renderView to false', () => {
        component.ngOnDestroy();
        expect(component.renderView).toBeFalsy();
    });
    it('User should be undefined when component is created', () => {
        expect(component.user).toBe(undefined);
    });

    it('Verify if the sendFriendRequest function called or not if called then addUserInvitation action should be fire', () => {
        component.user = { ...testData.userList[0] };
        component.loggedInUser = { ...testData.userList[1] };
        component.sendFriendRequest();
        expect(component.loader).toBe(true);
        expect(spy).toHaveBeenCalledWith(
            new UserActions().addUserInvitation({ userId: 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1', inviteeUserId: '4kFa6HRvP5OhvYXsH9mEsRrXj4o2' })
        );
    });

    it('Verify getImageUrl function works', () => {
        user = { ...testData.userList[1] };
        const expectedResult = '~/assets/images/avatar-400X400.png';
        expect(component.getImageUrl(user)).toEqual(expectedResult);
    });

    it('Verify topicsArray for different user login profile', () => {
        user = { ...testData.userList[0] };
        categoryDictionary.setResult(testData.categoryDictionary);
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
        categoryDictionary.setResult(testData.categoryDictionary);
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

    it('Verify tagsArray for different user login profile', () => {
        user = { ...testData.userList[0] };
        categoryDictionary.setResult(testData.categoryDictionary);
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

    it('Verify tagsArray for loggedIn user profile', () => {
        user = { ...testData.userList[1] };
        categoryDictionary.setResult(testData.categoryDictionary);
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


    //  this case is non required
    it('Verify topics for different user login profile', () => {
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
            expectedUserTopics = [...user.tags, user.categoryIds.map((data) => testData.categoryDictionary[data].categoryName)];
        } else {
            expectedUserTopics = [];
        }
        expect(component.topics).toEqual(expectedUserTopics);
    });

    it('Verify topics for same user login profile', () => {
        user = { ...testData.userList[1] };
        categoryDictionary.setResult(testData.categoryDictionary);
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
            expectedUserTopics = [...user.tags, user.categoryIds.map((data) => testData.categoryDictionary[data].categoryName)];
        } else {
            expectedUserTopics = [];
        }
        expect(component.topics).toEqual(expectedUserTopics);
    });

    it('Verify if initializeProfile function works', () => {
        user = { ...testData.userList[1] };
        const userDict = {
            'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': user
        };
        // mock data
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            userDict: userDict
        });
        mockStore.refreshState();
        fixture.detectChanges();
        component.initializeProfile().subscribe();
        expect(component.user).toEqual(userDict[user.userId]);
        expect(component.account).toEqual(user.account);
        expect(component.gamePlayedAgainst).toEqual(user.gamePlayed);
    });

    it('Verify applicationSetting for user', () => {
        user = { ...testData.userList[1] };
        const applicationSetting: any[] = [];
        applicationSetting.push(testData.applicationSettings);
        categoryDictionary.setResult(testData.categoryDictionary);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            applicationSettings: applicationSetting
        });
        mockStore.refreshState();
        fixture.detectChanges();
        component.initializeSocialSetting().subscribe();
        // Expected social profile settings
        const expectedSocialProfileSettings = applicationSetting[0].social_profile
            .filter(profile =>
                user &&
                user[profile.social_name]
                && user[profile.social_name] !== '');
        // Expected enable social profile
        const expectedEnableSocialProfile = expectedSocialProfileSettings.filter(profile => profile.enable).length;

        expect(component.applicationSettings).toEqual(applicationSetting[0]);
        expect(component.socialProfileObj).toEqual(applicationSetting[0].social_profile);
        expect(component.socialProfileSettings).toEqual(expectedSocialProfileSettings);
        expect(component.enableSocialProfile).toEqual(expectedEnableSocialProfile);
    });

    it('Verify otherUserTags from initializeProfile function', () => {
        user = { ...testData.userList[1] };
        const userDict = {
            'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': user
        };
        categoryDictionary.setResult(testData.categoryDictionary);
        // mock data
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            userDict: userDict
        });
        mockStore.refreshState();
        fixture.detectChanges();
        component.initializeProfile().subscribe();
        expect(component.tagsArray.otherUserTags).toEqual(user.tags);
    });

    it('Verify topicsArray from initializeProfile function', () => {
        user = { ...testData.userList[1] };
        const userDict = {
            'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': user
        };
        categoryDictionary.setResult(testData.categoryDictionary);
        // mock data
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            userDict: userDict
        });
        mockStore.refreshState();
        fixture.detectChanges();
        component.initializeProfile().subscribe();
        // Test other user topics
        const expectedOtherUserTopics = [...user.tags, ...user.categoryIds];
        expect(component.topicsArray.otherUserTopics).toEqual(expectedOtherUserTopics);
        // Test topics array comparison
        const expectedTopicArrayComparison = lodash.intersection(component.topicsArray.userTopics, component.topicsArray.otherUserTopics);
        expect(component.topicsArray.comparison).toEqual(expectedTopicArrayComparison);
    });

    it('Verify otherUserTags from initializeProfile function', () => {
        user = { ...testData.userList[1] };
        const userDict = {
            'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': user
        };
        categoryDictionary.setResult(testData.categoryDictionary);
        // mock data
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            userDict: userDict
        });
        mockStore.refreshState();
        fixture.detectChanges();
        component.initializeProfile().subscribe();
        const userTags = user.tags.join(', ');
        expect(component.tags.otherUserTags).toEqual(userTags);
    });

    it('Verify otherUserTopics from initializeProfile function', () => {
        user = { ...testData.userList[1] };
        const userDict = {
            'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': user
        };
        categoryDictionary.setResult(testData.categoryDictionary);
        // mock data
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            userDict: userDict
        });
        mockStore.refreshState();
        fixture.detectChanges();
        component.initializeProfile().subscribe();
        // Test other user topics
        const expectedOtherUserTopics = [...user.tags, user.categoryIds.map((data) => testData.categoryDictionary[data].categoryName)];
        expect(component.otherUserTopics).toEqual(expectedOtherUserTopics);
    });
    

    it('Verify otherUserTopicList from initializeProfile function', () => {
        user = { ...testData.userList[1] };
        const userDict = {
            'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': user
        };
        categoryDictionary.setResult(testData.categoryDictionary);
        // mock data
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            userDict: userDict
        });
        mockStore.refreshState();
        fixture.detectChanges();
        component.initializeProfile().subscribe();
        // Test other user topic list
        const expectedOtherUserTopics = [...user.tags, user.categoryIds.map((data) => testData.categoryDictionary[data].categoryName)];
        const expectedOtherUserTopicsList = expectedOtherUserTopics.join(', ');
        expect(component.otherUserTopicList).toEqual(expectedOtherUserTopicsList);
    });

    it('Verify userProfileImageUrl from initializeProfile function', () => {
        user = { ...testData.userList[1] };
        const userDict = {
            'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': user
        };
        categoryDictionary.setResult(testData.categoryDictionary);
        // mock data
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            userDict: userDict
        });
        mockStore.refreshState();
        fixture.detectChanges();
        component.initializeProfile().subscribe();

        const expectedUserProfileURL = component.getImageUrl(user);
        expect(component.userProfileImageUrl).toEqual(expectedUserProfileURL);
    });

    it('Verify socialProfileObj from initializeProfile function', () => {
        user = { ...testData.userList[1] };
        const userDict = {
            'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': user
        };
        categoryDictionary.setResult(testData.categoryDictionary);
        const applicationSetting: any[] = [];
        applicationSetting.push(testData.applicationSettings);
        // mock data
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            userDict: userDict,
            applicationSettings: applicationSetting
        });
        mockStore.refreshState();
        fixture.detectChanges();
        component.initializeSocialSetting().subscribe();
        component.initializeProfile().subscribe();
        expect(component.socialProfileObj).toEqual(applicationSetting[0].social_profile);
    });

    it('Verify userFriendInvitations from initializeProfile function', () => {
        user = { ...testData.userList[0] };
        const userDict = {
            'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': user
        };
        categoryDictionary.setResult(testData.categoryDictionary);
        const invitation = { 'data6@data.com': testData.invitation };
        const applicationSetting: any[] = [];
        applicationSetting.push(testData.applicationSettings);
        // mock data
        categoryDictionary.setResult(testData.categoryDictionary);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            userDict: userDict,
            userFriendInvitations: invitation,
            applicationSettings: applicationSetting
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalledWith(
            new UserActions().loadUserInvitationsInfo(component.loggedInUser.userId, user.email, user.userId)
        );
    });

    it('Check loggedInUserAccount info set properly or not', () => {
        user = { ...testData.userList[0] };
        categoryDictionary.setResult(testData.categoryDictionary);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            account: user.account
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.loggedInUserAccount).toEqual(user.account);
    });


    it('Check getIcon function works properly or not', () => {
        const expectedResult = String.fromCharCode(parseInt(`0x${100}`, 16));
        expect(component.getIcon(100)).toEqual(expectedResult);
    });

    it('Check startNewGame function works properly or not', () => {
        user = { ...testData.userList[1] };
        const navigateSpy = spyOn(router, 'navigate');
        // mock data
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
        });
        mockStore.refreshState();
        fixture.detectChanges();
        component.startNewGame();
        expect(navigateSpy).toHaveBeenCalledTimes(1);
    });

    it('Check isLivesEnable function it should return true value', () => {
        user = { ...testData.userList[0] };
        user.account.lives = 3;
        const userDict = {
            'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': user
        };
        categoryDictionary.setResult(testData.categoryDictionary);
        const applicationSetting: any[] = [testData.applicationSettings];
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            account: user.account,
            userDict: userDict,
            applicationSettings: applicationSetting,
        });
        mockStore.refreshState();
        component.initializeSocialSetting().subscribe();
        expect(component.isLivesEnable).toBe(true);
    });

    it('Check isLivesEnable function it should return false value', () => {
        user = { ...testData.userList[0] };
        user.account.lives = 0;
        const userDict = {
            'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': user
        };
        categoryDictionary.setResult(testData.categoryDictionary);
        const applicationSetting: any[] = [];
        applicationSetting.push(testData.applicationSettings);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            account: user.account,
            userDict: userDict,
            applicationSettings: applicationSetting,
        });
        mockStore.refreshState();
        component.initializeSocialSetting().subscribe();
        expect(component.isLivesEnable).toBe(false);
    });


    it('Check userInfo function return value', () => {
        user = { ...testData.userList[0] };
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
        });
        mockStore.refreshState();
        fixture.detectChanges();
        const expectedUserInfo = {
            showEditOrOptions: 'options',
            userId: '',
            routing: '/user/my/profile'
        };
        expect(component.userInfo).toEqual(expectedUserInfo);
    });
});
