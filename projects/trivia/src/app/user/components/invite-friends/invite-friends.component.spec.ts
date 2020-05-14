import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState, appState } from '../../../store';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { Utils } from 'shared-library/core/services';
import { Store } from '@ngrx/store';
import { UserActions } from 'shared-library/core/store';
import { InviteFriendsComponent } from './invite-friends.component';
import { CdkColumnDef, CdkRowDef, CdkHeaderRowDef } from '@angular/cdk/table';
import { PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material';

describe('InviteFriendsComponent', () => {
    let component: InviteFriendsComponent;
    let fixture: ComponentFixture<InviteFriendsComponent>;
    let spy: any;
    let mockStore: MockStore<AppState>;
    let mount;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InviteFriendsComponent, CdkColumnDef, CdkRowDef, CdkHeaderRowDef],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: Utils,
                    useValue: {}
                },
                {
                    provide: UserActions,
                    useValue: {}
                },
                {
                    provide: MatDialog,
                    useValue: {}
                },
                { provide: PLATFORM_ID, useValue: {} },
                provideMockStore({
                    selectors: [
                        {
                            selector: appState.coreState,
                            value: {
                            }
                        }
                    ]
                })
            ],
            imports: [ ]
        });
    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(InviteFriendsComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        component = fixture.debugElement.componentInstance;
        // mount = createMount();
    });

    // Check created component
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be inited', () => {
        expect(component.displayedColumns).toEqual(["friends", "game_played", "won", "lost"]);
    });



});
