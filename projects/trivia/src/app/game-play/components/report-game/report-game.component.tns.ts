import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable } from 'rxjs';
import { Utils } from 'shared-library/core/services';
import { Category, FirebaseScreenNameConstants, Game, Question, QuestionMetadata, ReportQuestion, User } from 'shared-library/shared/model';
import { isAndroid, isIOS } from 'tns-core-modules/ui/page/page';
import { AppState, categoryDictionary } from '../../../store';
import * as gameplayactions from '../../store/actions';
declare var IQKeyboardManager;
@Component({
    selector: 'report-game',
    templateUrl: './report-game.component.html',
    styleUrls: ['./report-game.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class ReportGameComponent implements OnInit, OnDestroy {
    iqKeyboard: any;
    question: Question;
    reportQuestion: ReportQuestion;
    user: User;
    game: Game;
    ref: any;
    userDict: { [key: string]: User };
    categoryDict$: Observable<{ [key: number]: Category }>;
    categoryDict: { [key: number]: Category };
    issue = '';
    checkTest: boolean;
    reportOptions?: Array<ReportOption>;
    selectedOption: string = null;
    otherReason: string = null;
    subscriptions = [];

    @ViewChildren('textField') textField: QueryList<ElementRef>;

    constructor(private store: Store<AppState>, private params: ModalDialogParams, public utils: Utils,
        private cd: ChangeDetectorRef) {
        if (isIOS) {
            this.iqKeyboard = IQKeyboardManager.sharedManager();
            this.iqKeyboard.shouldResignOnTouchOutside = true;
        }
        this.categoryDict$ = store.select(categoryDictionary);
        this.subscriptions.push(this.categoryDict$.subscribe(categoryDict => {
            this.categoryDict = categoryDict;
            this.cd.markForCheck();
        }));

        this.question = params.context.question;
        this.user = params.context.user;
        this.game = params.context.game;
        this.userDict = params.context.userDict;

        this.reportOptions = [
            new ReportOption('Offensive content'),
            new ReportOption('Spelling or grammar error'),
            new ReportOption('Wrong answer'),
            new ReportOption('Incorrect category or tags'),
            new ReportOption('Question is not clear'),
            new ReportOption('Spam'),
            new ReportOption('Other')
        ];
        this.cd.markForCheck();


    }

    ngOnInit() {
        this.reportQuestion = new ReportQuestion();
        this.cd.markForCheck();
    }

    saveReportQuestion() {
        this.hideKeyboard();
        if (this.selectedOption == null) {
            this.utils.showMessage('error', 'Select issue!');
            return;
        }
        if (this.otherReason === null && this.selectedOption === 'Other') {
            this.utils.showMessage('error', 'Reason is required!');
            return;
        } {
            this.reportQuestion.gameId = this.game.gameId;
            let reason: string;

            this.reportQuestion.created_uid = this.user.userId;
            if (this.selectedOption === 'Other') {
                reason = this.otherReason;
            } else {
                reason = this.selectedOption;
            }
            const info: { [key: string]: QuestionMetadata } = {};
            const questionMetadata = new QuestionMetadata();
            questionMetadata.reason = reason;

            info[this.question.id] = { ...questionMetadata };
            this.reportQuestion.questions = info;
            this.store.dispatch(new gameplayactions.SaveReportQuestion({ reportQuestion: this.reportQuestion, game: this.game }));
            this.params.closeCallback();
        }
        this.cd.markForCheck();
    }

    changeCheckedRadio(reportOption: ReportOption): void {
        reportOption.selected = !reportOption.selected;
        if (!reportOption.selected) {
            return;
        }
        this.selectedOption = reportOption.text;
        // uncheck all other optionss
        this.reportOptions.forEach(option => {
            if (option.text !== reportOption.text) {
                option.selected = false;
            }
        });
        this.cd.markForCheck();
    }

    get otherAnswer() {
        const otherAnswer = this.question.answers.filter(ans => !ans.correct).map(ans => ans.answerText);
        return otherAnswer;
    }

    get correctAnswer() {
        const correctAnswer = this.question.answers.filter(ans => ans.correct).map(ans => ans.answerText);
        return correctAnswer;
    }

    get categoryName() {
        const categories = this.question.categoryIds.map(id => {
            return this.categoryDict[id];
        });
        return categories.map(category => category.categoryName).join(',');
    }

    onClose(): void {
        this.params.closeCallback();
    }

    ngOnDestroy() {
    }

    hideKeyboard() {
        if (isAndroid) {
            this.utils.hideKeyboard(this.textField);
        }
    }

}

export class ReportOption {
    text: string;
    selected: Boolean = false;
    constructor(text: string) {
        this.text = text;
    }
}

