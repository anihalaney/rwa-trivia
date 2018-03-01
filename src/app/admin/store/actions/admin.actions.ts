import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { SearchCriteria, SearchResults, Question } from '../../../model';

export enum AdminActionTypes {
    LOAD_QUESTIONS = '[Admin] LoadQuestions',
    LOAD_QUESTIONS_SUCCESS = '[Admin] LoadQuestionsSuccess',
    LOAD_UNPUBLISHED_QUESTIONS = '[Admin] LoadUnpublishedQuestions',
    LOAD_UNPUBLISHED_QUESTIONS_SUCCESS = '[Admin] LoadUnpublishedQuestionsSuccess',
    APPROVE_QUESTION = '[Admin] ApproveQuestion'
}

// Load Question As per Search critearea
export class LoadQuestions implements Action {
    readonly type = AdminActionTypes.LOAD_QUESTIONS;
    constructor(public payload: { startRow: number, pageSize: number, criteria: SearchCriteria }) { }
}

// Load Question As per Serach critearea Success
export class LoadQuestionsSuccess implements Action {
    readonly type = AdminActionTypes.LOAD_QUESTIONS_SUCCESS;
    constructor(public payload: SearchResults) { }
}

// Load All Unpublished Question
export class LoadUnpublishedQuestions implements Action {
    readonly type = AdminActionTypes.LOAD_UNPUBLISHED_QUESTIONS;
    constructor() { }
}

// Load All Unpublished Question Success
export class LoadUnpublishedQuestionsSuccess implements Action {
    readonly type = AdminActionTypes.LOAD_UNPUBLISHED_QUESTIONS_SUCCESS;
    constructor(public payload: Question[]) { }
}

// Approve Question
export class ApproveQuestion implements Action {
    readonly type = AdminActionTypes.APPROVE_QUESTION;
    constructor(public payload: { question: Question }) { }
}


export type AdminActions
    = LoadQuestions
    | LoadQuestionsSuccess
    | LoadUnpublishedQuestions
    | LoadUnpublishedQuestionsSuccess
    | ApproveQuestion

