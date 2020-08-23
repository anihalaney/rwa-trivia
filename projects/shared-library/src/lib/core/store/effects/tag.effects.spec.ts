import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { cold, hot } from 'jest-marbles';
import { Actions } from '@ngrx/effects';
import { testData } from 'test/data';
import { TagEffects } from './tag.effects';
import { TagService } from '../../../core/services/tag.service';
import { TagActions } from '../actions';
import { RouterStateUrl } from '../../../shared/model';
import { RoutesRecognized } from '@angular/router';
import { RouterNavigationPayload, RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';

describe('TagEffects', () => {
    let effects: TagEffects;
    let actions$: Observable<any>;
    let tagService: any;
    const tags: string[] = testData.tagList;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                TagActions,
                TagEffects,
                {
                    provide: TagService,
                    useValue: { getTags: jest.fn() }
                },
                provideMockActions(() => actions$),
            ],
        });
        effects = TestBed.get(TagEffects);
        tagService = TestBed.get(TagService);
        actions$ = TestBed.get(Actions);
    });

    it('load tags', () => {
        const routerState: RouterStateUrl = { url: '/', queryParams: {}, params: {} };
        const event: RoutesRecognized = new RoutesRecognized(1, '/', '', null);
        const payload: RouterNavigationPayload<RouterStateUrl> = {
            routerState,
            event
        };
        const action: RouterNavigationAction<RouterStateUrl> = {
            type: ROUTER_NAVIGATION,
            payload
        };

        const completion = new TagActions().loadTagsSuccess(tags);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: tags });
        const expected = cold('--b', { b: completion });
        tagService.getTags = jest.fn(() => response);
        expect(effects.loadRouteTags$).toBeObservable(expected);
    });

    it('load top tags', () => {
        const topTags = testData.getTopTags;
        const action = new TagActions().loadTopTags();
        const completion = new TagActions().loadTopTagsSuccess(topTags);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: topTags });
        const expected = cold('--b', { b: completion });
        tagService.getTopTags = jest.fn(() => response);
        expect(effects.getTopTags$).toBeObservable(expected);
    });

});