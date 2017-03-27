import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { EffectsTestingModule, EffectsRunner } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';
import { AngularFire } from 'angularfire2';
import { Store } from '@ngrx/store';

import { TEST_DATA } from '../../../testing/test.data';
import { MockStore } from '../../../testing/mock-store';
import { QuestionEffects } from './question.effects';
import { QuestionActions } from '../actions';
import { QuestionService } from '../../services';

describe('Effects: QuestionEffects', () => {
  let _runner: EffectsRunner;
  let _effects: QuestionEffects;
  let _service: QuestionService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      EffectsTestingModule
    ],
    providers: [
      QuestionEffects, QuestionActions, QuestionService,
      { "provide": AngularFire, "useValue": {} },
      { "provide": Store, "useValue": new MockStore({}) }
    ]
  }));

  it('Call Load Questions Success action after Load Questions',
    inject([
      EffectsRunner, QuestionEffects, QuestionService
    ],
    (runner, questionEffects, questionService) => {
      _runner = runner;
      _effects = questionEffects;
      _service = questionService;

      spyOn(_service, 'getQuestions')
          .and.returnValue(Observable.of(TEST_DATA.questions.published));

      _runner.queue({ type: QuestionActions.LOAD_QUESTIONS });

      _effects.loadQuestions$.subscribe(result => {
        expect(result.type).toEqual(QuestionActions.LOAD_QUESTIONS_SUCCESS);
        expect(result.payload).toEqual(TEST_DATA.questions.published);
      });
    })
  );

  it('Call Load Unpublished Questions Success action after Load  Unpublished Questions',
    inject([
      EffectsRunner, QuestionEffects, QuestionService
    ],
    (runner, questionEffects, questionService) => {
      _runner = runner;
      _effects = questionEffects;
      _service = questionService;

      spyOn(_service, 'getUnpublishedQuestions')
          .and.returnValue(Observable.of(TEST_DATA.questions.published));

      _runner.queue({ type: QuestionActions.LOAD_UNPUBLISHED_QUESTIONS });

      _effects.loadUnpublishedQuestions$.subscribe(result => {
        expect(result.type).toEqual(QuestionActions.LOAD_UNPUBLISHED_QUESTIONS_SUCCESS);
        expect(result.payload).toEqual(TEST_DATA.questions.published);
      });
    })
  );

  it('Call Load User Questions Success action after Load  User Questions',
    inject([
      EffectsRunner, QuestionEffects, QuestionService
    ],
    (runner, questionEffects, questionService) => {
      _runner = runner;
      _effects = questionEffects;
      _service = questionService;

      spyOn(_service, 'getUserQuestions')
          .and.returnValue(Observable.of(TEST_DATA.questions.published));

      _runner.queue({ type: QuestionActions.LOAD_USER_QUESTIONS });

      _effects.loadUserQuestions$.subscribe(result => {
        expect(result.type).toEqual(QuestionActions.LOAD_USER_QUESTIONS_SUCCESS);
        expect(result.payload).toEqual(TEST_DATA.questions.published);
      });

    })
  );

  it('Call Load Sample Questions Success action after Load Sample Questions',
    inject([
      EffectsRunner, QuestionEffects, QuestionService
    ],
    (runner, questionEffects, questionService) => {
      _runner = runner;
      _effects = questionEffects;
      _service = questionService;

      spyOn(_service, 'getSampleQuestions')
          .and.returnValue(Observable.of(TEST_DATA.questions.published));

      _runner.queue({ type: QuestionActions.LOAD_SAMPLE_QUESTIONS });

      _effects.loadSampleQuestions$.subscribe(result => {
        expect(result.type).toEqual(QuestionActions.LOAD_SAMPLE_QUESTIONS_SUCCESS);
        expect(result.payload).toEqual(TEST_DATA.questions.published);
      });
    })
  );

  it('Call Save Question service after when adding Question',
    inject([
      EffectsRunner, QuestionEffects, QuestionService
    ],
    (runner, questionEffects, questionService) => {
      _runner = runner;
      _effects = questionEffects;
      _service = questionService;

      spyOn(_service, 'saveQuestion')
          .and.returnValue(Observable.of(TEST_DATA.questions.published[0]));

      _runner.queue({ type: QuestionActions.ADD_QUESTION });

      _effects.addQuestion$.subscribe(result => {
        expect(result).toEqual(false);
        expect(result.payload).toEqual(null);
      });
    })
  );

  it('Call Approve Question service after when calling approve Question',
    inject([
      EffectsRunner, QuestionEffects, QuestionService
    ],
    (runner, questionEffects, questionService) => {
      _runner = runner;
      _effects = questionEffects;
      _service = questionService;

      spyOn(_service, 'approveQuestion')
          .and.returnValue(Observable.of(TEST_DATA.questions.published[0]));

      _runner.queue({ type: QuestionActions.APPROVE_QUESTION });

      _effects.approveQuestion$.subscribe(result => {
        expect(result).toEqual(false);
        expect(result.payload).toEqual(null);
      });
    })
  );

});
