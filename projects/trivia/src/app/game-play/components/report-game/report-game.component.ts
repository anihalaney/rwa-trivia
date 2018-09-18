import { Component, Input, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {
    ReportQuestion, User, Game, QuestionMetadata, Category, Question
} from '../../../../../../shared-library/src/lib/shared/model';
import { AppState, categoryDictionary } from '../../../store';
import * as gameplayactions from '../../store/actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'report-game',
    templateUrl: './report-game.component.html',
    styleUrls: ['./report-game.component.scss']
})
export class ReportGameComponent implements OnInit {

    question: Question;
    reportQuestionForm: FormGroup;
    reportQuestion: ReportQuestion;
    user: User;
    game: Game;
    ref: any;
    userDict: { [key: string]: User };
    categoryDict$: Observable<{ [key: number]: Category }>;
    categoryDict: { [key: number]: Category };

    constructor(private fb: FormBuilder, private store: Store<AppState>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.question = data.question;
        this.user = data.user;
        this.game = data.game;
        this.userDict = data.userDict;

        this.categoryDict$ = store.select(categoryDictionary);
        this.categoryDict$.subscribe(categoryDict => {
            this.categoryDict = categoryDict;
        });

    }


    ngOnInit() {
        this.reportQuestion = new ReportQuestion();
        this.reportQuestionForm = this.createForm(this.reportQuestion);
    }
    createForm(reportQuestion: ReportQuestion) {
        const form: FormGroup = this.fb.group({
            reason: new FormControl('Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantiu, doloremque landantium.'),
            otherReason: ''
        });
        return form;
    }

    saveReportQuestion() {
        this.reportQuestion.gameId = this.game.gameId;
        let reason = '';

        this.reportQuestion.created_uid = this.user.userId;
        if (this.reportQuestionForm.get('reason').value === 'other') {
            reason = this.reportQuestionForm.get('otherReason').value;
        } else {
            reason = this.reportQuestionForm.get('reason').value;
        }
        const info: { [key: string]: QuestionMetadata } = {};
        const questionMetadata = new QuestionMetadata();
        questionMetadata.reason = reason;

        info[this.question.id] = { ...questionMetadata };
        this.reportQuestion.questions = info;
        this.store.dispatch(new gameplayactions.SaveReportQuestion({ reportQuestion: this.reportQuestion, game: this.game }));

    }
    closeModel() {
        this.ref.close();
    }

}

