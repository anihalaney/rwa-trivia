import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';

import {AppStore} from '../app-store';
import {Question} from '../../model';
import {QuestionActions} from '../actions';
import {QuestionService} from '../../services'

@Injectable()
export class QuestionEffects {
    constructor (
        private actions$: Actions,
        private questionActions: QuestionActions,
        private svc: QuestionService
    ) {}

    @Effect() 
    loadQuestions$ = this.actions$
        .ofType(QuestionActions.LOAD_QUESTIONS)
        .switchMap(() => this.svc.getQuestions())
        .map((questions: Question[]) => this.questionActions.loadQuestionsSuccess(questions));

    @Effect() 
    addQuestion$ = this.actions$
        .ofType(QuestionActions.ADD_QUESTION)
        .switchMap((action) => this.svc.saveQuestion(action.payload))
        .map((question: Question) => this.questionActions.addQuestionSuccess(question));
}
