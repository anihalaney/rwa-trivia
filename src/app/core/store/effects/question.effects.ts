import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../app-store';
import { Question, User, SearchResults, SearchCriteria, BulkUpload, BulkUploadFileInfo } from '../../../model';
import { ActionWithPayload, QuestionActions } from '../actions';
import { QuestionService } from '../../services'

@Injectable()
export class QuestionEffects {

    @Effect()
    loadQuestions$ = this.actions$
        .ofType(QuestionActions.LOAD_QUESTIONS)
        .switchMap((action: ActionWithPayload<{ startRow: number, pageSize: number, criteria: SearchCriteria }>) =>
            this.svc.getQuestions(action.payload.startRow, action.payload.pageSize, action.payload.criteria))
        .map((results: SearchResults) => this.questionActions.loadQuestionsSuccess(results));

    @Effect()
    loadUnpublishedQuestions$ = this.actions$
        .ofType(QuestionActions.LOAD_UNPUBLISHED_QUESTIONS)
        .switchMap(() => this.svc.getUnpublishedQuestions())
        .map((questions: Question[]) => this.questionActions.loadUnpublishedQuestionsSuccess(questions));

    @Effect()
    loadUserPublishedQuestions$ = this.actions$
        .ofType(QuestionActions.LOAD_USER_PUBLISHED_QUESTIONS)
        .switchMap((action: ActionWithPayload<User>) => this.svc.getUserQuestions(action.payload, true))
        .map((questions: Question[]) => this.questionActions.loadUserPublishedQuestionsSuccess(questions));

    @Effect()
    loadUserUnpublishedQuestions$ = this.actions$
        .ofType(QuestionActions.LOAD_USER_PUBLISHED_QUESTIONS)
        .switchMap((action: ActionWithPayload<User>) => this.svc.getUserQuestions(action.payload, false))
        .map((questions: Question[]) => this.questionActions.loadUserUnpublishedQuestionsSuccess(questions));


    // get File Unpublished Questions
    @Effect()
    loadBulkUploadUnpublishedQuestions$ = this.actions$
        .ofType(QuestionActions.LOAD_BULK_UPLOAD_UNPUBLISHED_QUESTIONS)
        .switchMap((action: ActionWithPayload<BulkUploadFileInfo>) => this.svc.getQuestionsForBulkUpload(action.payload, false))
        .map((questions: Question[]) => this.questionActions.loadBulkUploadUnpublishedQuestionsSuccess(questions));

    // get File Published Questions
    @Effect()
    loadBulkUploadPublishedQuestions$ = this.actions$
        .ofType(QuestionActions.LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS)
        .switchMap((action: ActionWithPayload<BulkUploadFileInfo>) => this.svc.getQuestionsForBulkUpload(action.payload, true))
        .map((questions: Question[]) => this.questionActions.loadBulkUploadPublishedQuestionsSuccess(questions));


    // delete Unpublished Questions
    @Effect()
    deleteUnpublishedQuestions$ = this.actions$
        .ofType(QuestionActions.DELETE_UNPUBLISHED_QUESTION)
        .do((action: ActionWithPayload<Question>) => this.svc.deleteUnpublishedQuestion(action.payload))
        .filter(() => false);


    @Effect()
    loadSampleQuestions$ = this.actions$
        .ofType(QuestionActions.GET_QUESTION_OF_THE_DAY)
        .switchMap(() => this.svc.getQuestionOfTheDay())
        .map((question: Question) => this.questionActions.getQuestionOfTheDaySuccess(question));

    @Effect()
    addQuestion$ = this.actions$
        .ofType(QuestionActions.ADD_QUESTION)
        .do((action: ActionWithPayload<Question>) => this.svc.saveQuestion(action.payload))
        .filter(() => false);

    @Effect()
    addBulkQuestions$ = this.actions$
        .ofType(QuestionActions.ADD_BULK_QUESTIONS)
        .do((action: ActionWithPayload<BulkUpload>) => this.svc.saveBulkQuestions(action.payload))
        .filter(() => false);

    @Effect()
    approveQuestion$ = this.actions$
        .ofType(QuestionActions.APPROVE_QUESTION)
        .do((action: ActionWithPayload<Question>) => this.svc.approveQuestion(action.payload))
        .filter(() => false);

    constructor(
        private actions$: Actions,
        private questionActions: QuestionActions,
        private svc: QuestionService
    ) { }
}
