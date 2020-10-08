import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren, Input, SimpleChanges, OnChanges, Output, EventEmitter
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { Observable } from 'rxjs';
import { Utils } from 'shared-library/core/services';
import { Category, FirebaseScreenNameConstants, Game, Question, QuestionMetadata, ReportQuestion, User } from 'shared-library/shared/model';
import { isIOS } from 'tns-core-modules/ui/page/page';
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
    @Input() question: Question;
    reportQuestion: ReportQuestion;
    @Input() user: User;
    @Input() game: Game;
    ref: any;
    @Input() userDict: { [key: string]: User };
    @Output() closePopUp = new EventEmitter<boolean>();
    categoryDict$: Observable<{ [key: number]: Category }>;
    categoryDict: { [key: number]: Category };
    issue = '';
    checkTest: boolean;
    reportOptions?: Array<ReportOption>;
    selectedOption: string = null;
    otherReason: string = null;
    subscriptions = [];

    @ViewChildren('textField') textField: QueryList<ElementRef>;

    constructor(private store: Store<AppState>, public utils: Utils,
        private cd: ChangeDetectorRef) {
        if (isIOS) {
            this.iqKeyboard = IQKeyboardManager.sharedManager();
            this.iqKeyboard.shouldResignOnTouchOutside = true;
        }

        this.generateNewReportOptions();
        this.cd.markForCheck();
    }

    ngOnInit() {
        this.categoryDict$ = this.store.select(categoryDictionary);
        this.subscriptions.push(this.categoryDict$.subscribe(categoryDict => {
            this.categoryDict = categoryDict;
            this.cd.markForCheck();
        }));

        this.reportQuestion = new ReportQuestion();
        this.cd.markForCheck();
    }

    saveReportQuestion() {
        this.hideKeyboard();
        const selectedReasons: string[] = [];
        this.reportOptions.map((res) => {
            if (res.selected && res.text !== 'Other') {
                selectedReasons.push(res.text);
            }
        });

        if (this.otherReason !== null && this.otherReason !== '') {
            selectedReasons.push(this.otherReason);
        }

        if (Array.isArray(selectedReasons) && selectedReasons.length <= 0) {
            this.utils.showMessage('error', 'Select any one!');
            return;
        }
        this.reportQuestion.gameId = this.game.gameId;
        this.reportQuestion.created_uid = this.user.userId;
        const info: { [key: string]: QuestionMetadata } = {};
        const questionMetadata = new QuestionMetadata();
        questionMetadata.reasons = selectedReasons;

        info[this.question.id] = { ...questionMetadata };
        this.reportQuestion.questions = info;

        this.store.dispatch(new gameplayactions.SaveReportQuestion({ reportQuestion: this.reportQuestion, game: this.game }));
        this.generateNewReportOptions();
        this.closePopUp.emit(false);
        this.cd.markForCheck();
    }

    selectReasons(i): void {
        const reportOptions = this.reportOptions[i];
        reportOptions.selected = !reportOptions.selected;
        this.reportOptions = [...this.reportOptions];
        this.cd.markForCheck();
    }

    closeDialogReport() {
        this.generateNewReportOptions();
        this.closePopUp.emit(false);
    }

    get otherAnswer() {
        if (this.question) {
            const otherAnswer = this.question.answers.filter(ans => !ans.correct);
            return otherAnswer;
        }
        return '';

    }

    get correctAnswer() {
        if (this.question) {
            const correctAnswer = this.question.answers.filter(ans => ans.correct);
            return correctAnswer;
        }
        return '';
    }
    get categoryName() {
        if (this.question) {
            const categories = this.question.categoryIds.map(id => {
                return this.categoryDict[id];
            });
            if (categories.length > 0) {
                return categories.map(category => category.categoryName).join(',');
            }

        }
        return '';
    }

    ngOnDestroy() {
    }

    hideKeyboard() {
        this.utils.hideKeyboard(this.textField);
    }

    public generateNewReportOptions() {
        this.reportOptions = [
            new ReportOption('Offensive content'),
            new ReportOption('Spelling or grammar error'),
            new ReportOption('Wrong answer'),
            new ReportOption('Incorrect category or tags'),
            new ReportOption('Question is not clear'),
            new ReportOption('Spam'),
            new ReportOption('Other')
        ];
    }

}

export class ReportOption {
    text: string;
    selected: Boolean = false;
    constructor(text: string) {
        this.text = text;
    }
}

