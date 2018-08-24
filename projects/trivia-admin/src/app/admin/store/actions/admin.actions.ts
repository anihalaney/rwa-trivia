import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { SearchCriteria, SearchResults, Question } from '../../../../../../shared-library/src/lib/shared/model';

export enum AdminActionTypes {
    LOAD_QUESTIONS = '[Admin] LoadQuestions',
    LOAD_QUESTIONS_SUCCESS = '[Admin] LoadQuestionsSuccess',
    LOAD_UNPUBLISHED_QUESTIONS = '[Admin] LoadUnpublishedQuestions',
    LOAD_UNPUBLISHED_QUESTIONS_SUCCESS = '[Admin] LoadUnpublishedQuestionsSuccess',
    APPROVE_QUESTION = '[Admin] ApproveQuestion',
    SAVE_QUESTION_TOGGLE_STATE = '[Admin] SaveQuestionToggleState',
    SAVE_ARCHIVE_TOGGLE_STATE = '[Admin] SaveArchiveToggleState'
}

// Load Question As per Search criteria
export class LoadQuestions implements Action {
    readonly type = AdminActionTypes.LOAD_QUESTIONS;
    constructor(public payload: { startRow: number, pageSize: number, criteria: SearchCriteria }) { }
}

// Load Question As per Search criteria Success
export class LoadQuestionsSuccess implements Action {
    readonly type = AdminActionTypes.LOAD_QUESTIONS_SUCCESS;
    constructor(public payload: SearchResults) { }
}

// Load All Unpublished Question
export class LoadUnpublishedQuestions implements Action {
    readonly type = AdminActionTypes.LOAD_UNPUBLISHED_QUESTIONS;
    constructor(public payload: { question_flag: boolean }) { }
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

// Save Question State
export class SaveQuestionToggleState implements Action {
    readonly type = AdminActionTypes.SAVE_QUESTION_TOGGLE_STATE;
    constructor(public payload: { toggle_state: string }) { }
}

// Save Question State
export class SaveArchiveToggleState implements Action {
    readonly type = AdminActionTypes.SAVE_ARCHIVE_TOGGLE_STATE;
    constructor(public payload: { toggle_state: boolean }) { }
}


export type AdminActions
    = LoadQuestions
    | LoadQuestionsSuccess
    | LoadUnpublishedQuestions
    | LoadUnpublishedQuestionsSuccess
    | ApproveQuestion
    | SaveQuestionToggleState
    | SaveArchiveToggleState

