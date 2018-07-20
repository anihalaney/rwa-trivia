import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import { Actions } from '@ngrx/effects';
import { TEST_DATA } from '../../../testing/test.data';
import { QuestionEffects } from './question.effects';
import { QuestionService } from '../../../core/services/question.service';
import { Question, Answer, RouterStateUrl } from '../../../model';
import { StoreModule, Store } from '@ngrx/store';
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';
import { CONFIG } from '../../../../environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationProvider, AuthInterceptor } from '../../../../app/core/auth';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { QuestionActions } from '../index';
import { RouterState } from '@angular/router/src/router_state';


export const firebaseConfig: FirebaseAppConfig = CONFIG.firebaseConfig;


describe('Effects: QuestionEffects', () => {
    let effects: QuestionEffects;
    let actions$: Observable<any>;
    let questionService: any;
    let state: RouterStateUrl;

    beforeEach(($state) => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({}), AngularFireModule.initializeApp(firebaseConfig),
                AngularFirestoreModule, AngularFirestoreModule, HttpClientModule, AngularFireStorageModule],
            providers: [
                AngularFirestore,
                QuestionEffects,
                {
                    provide: QuestionService,
                    useValue: { getQuestionOfTheDay: jest.fn() },
                },
                QuestionActions,
                provideMockActions(() => actions$),
                {
                    provide: HTTP_INTERCEPTORS,
                    multi: true,
                }
            ],
        });

        effects = TestBed.get(QuestionEffects);
        questionService = TestBed.get(QuestionService);
        actions$ = TestBed.get(Actions);

    });
    const question: Question = TEST_DATA.questions.published.filter(obj => { return obj.id === '1' })[0];


    it('loadNextQuestionOfDay', () => {

        state.url = '/dashboard';
        const action = new QuestionActions().getQuestionOfTheDay();
        const completion = new QuestionActions().getQuestionOfTheDaySuccess(question);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: question });
        const expected = cold('--b', { b: completion });
        questionService.getQuestionOfTheDay = jest.fn(() => response);

        expect(effects.loadNextQuestionOfDay$).toBeObservable(expected);
    });
});