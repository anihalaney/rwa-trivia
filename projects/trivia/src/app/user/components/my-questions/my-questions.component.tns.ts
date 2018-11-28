import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { QuestionActions } from 'shared-library/core/store';
import { User } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { MyQuestions } from './my-questions';
import { TabView } from 'tns-core-modules/ui/tab-view';

@Component({
  selector: 'my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.css']
})
export class MyQuestionsComponent extends MyQuestions implements OnDestroy {

  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};

  constructor(public store: Store<AppState>,
    public questionActions: QuestionActions,
    public utils: Utils) {
    super(store, questionActions, utils);
    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subs.push(this.userDict$.subscribe(userDict => this.userDict = userDict));
  }


  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }

}
