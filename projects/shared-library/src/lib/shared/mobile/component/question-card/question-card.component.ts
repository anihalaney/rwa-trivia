import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Question } from './../../../model/question';
import { select, Store } from '@ngrx/store';
import { CoreState, coreState, categoryDictionary } from '../../../../core/store';
import { ApplicationSettings } from 'shared-library/shared/model';

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.scss']
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class QuestionCardComponent implements OnInit, OnDestroy {


  @Input() question: Question;
  categoryDictionary: any;
  subscriptions = [];
  applicationSettings: ApplicationSettings;

  constructor(private store: Store<CoreState>, private cd: ChangeDetectorRef) { }

  ngOnInit() {

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.applicationSettings))
      .subscribe(appSettings => {
        if (appSettings) {
          this.applicationSettings = appSettings[0];
          this.cd.markForCheck();
        }
      }));

      this.subscriptions.push(this.store.select(categoryDictionary).subscribe(categories => {
        this.categoryDictionary = categories;
        console.log('test');
        console.log(this.categoryDictionary);
      }));
  }

  ngOnDestroy(): void {
  }

}
