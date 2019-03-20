import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';
import { QuestionActions } from 'shared-library/core/store';
import { User, Question, QuestionStatus } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { MyQuestions } from './my-questions';
import { Page } from 'tns-core-modules/ui/page';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';


@Component({
  selector: 'my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.css']
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class MyQuestionsComponent extends MyQuestions implements OnInit, OnDestroy {

  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};
  displayReasonViewer = false;
  displayEditQuestion = false;
  selectedQuestion: Question;
  tabIndex = 0;
  subscriptions = [];
  // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;

  constructor(public store: Store<AppState>,
    public questionActions: QuestionActions,
    private routerExtension: RouterExtensions,
    private page: Page, private cd: ChangeDetectorRef,
    private ngZone: NgZone) {
    super(store, questionActions);
    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => {
      this.userDict = userDict;
      this.cd.markForCheck();
    }));
  }

  ngOnInit(): void {
    // update to variable needed to do in ngZone otherwise it did not understand it
    this.page.on('loaded', () => this.ngZone.run(() => {
      this.renderView = true;
      this.cd.markForCheck();
    }));
  }

  navigateToSubmitQuestion() {
    this.routerExtension.navigate(['/my/questions/add']);
  }

  displayReason(reasonFlag: boolean) {
    this.displayReasonViewer = reasonFlag;
    this.page.actionBarHidden = reasonFlag;
  }

  setSelectedQuestion(question: Question) {
    this.selectedQuestion = question;
  }

  showUpdateQuestion(displayFlag: boolean) {
    this.displayReasonViewer = false;
    this.displayEditQuestion = displayFlag;
    this.page.actionBarHidden = !displayFlag;
  }

  hideQuestion(displayEditQuestion: boolean) {
    this.displayEditQuestion = false;
    this.page.actionBarHidden = false;
  }

  getDisplayStatus(status: number): string {
    return QuestionStatus[status];
  }

  setTabIndex(index: number) {
    this.tabIndex = index;
  }
  ngOnDestroy() {
    this.page.off('loaded');
  }

}
