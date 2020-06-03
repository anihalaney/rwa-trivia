import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { QuestionActions } from 'shared-library/core/store';
import { Category, Question, User, ApplicationSettings } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { userState } from '../../../user/store';
import { ChangeDetectorRef } from '@angular/core';

export class MyQuestions {

  publishedQuestions: Question[];
  unpublishedQuestions: Question[];
  draftQuestions: Question[];
  categoryDictObs: Observable<{ [key: number]: Category }>;
  categoriesObs: Observable<Category[]>;
  tagsObs: Observable<string[]>;
  user: User;
  loaderBusy = false;
  subscriptions: Subscription[] = [];
  applicationSettings: ApplicationSettings;
  quillConfig = {
    toolbar: {
      container: [],
      handlers: {
        // handlers object will be merged with default handlers object
        'mathEditor': () => {
        }
      }
    },
    mathEditor: {},
    blotFormatter: {},
    syntax: true
  };

  constructor(public store: Store<AppState>,
    public questionActions: QuestionActions,
    public cd: ChangeDetectorRef,
  ) {

    this.loaderBusy = true;

    this.categoriesObs = store.select(appState.coreState).pipe(select(s => s.categories));
    this.tagsObs = store.select(appState.coreState).pipe(select(s => s.tags));

    this.subscriptions.push(this.store.select(appState.coreState).subscribe((s) => {
      this.user = s.user;
    }));
    this.subscriptions.push(this.store.select(userState).pipe(select(s => s.userPublishedQuestions)).subscribe((questions) => {
      this.publishedQuestions = questions;
      this.hideLoader();
    }));
    this.subscriptions.push(this.store.select(userState).pipe(select(s => s.userUnpublishedQuestions)).subscribe((questions) => {
      if (questions) {
        this.unpublishedQuestions = questions;
      }

      this.hideLoader();
    }));

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings) {
        this.applicationSettings = appSettings[0];
        if (this.applicationSettings && this.applicationSettings.quill_options) {
          this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.options);
          this.quillConfig.toolbar.container.push(this.applicationSettings.quill_options.list);
          this.quillConfig.mathEditor = { mathOptions: this.applicationSettings };
        }
      }
    }));

  }

  hideLoader() {
    if (this.publishedQuestions && this.unpublishedQuestions) {
      setTimeout(() => {
        this.toggleLoader(false);
      }, 1000);
    }
  }

  toggleLoader(flag: boolean) {
    this.loaderBusy = flag;
    this.cd.markForCheck();
  }
}
