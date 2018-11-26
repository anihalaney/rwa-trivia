import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { QuestionActions } from 'shared-library/core/store';
import { User, Question, QuestionStatus, Category } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState, categoryDictionary } from '../../../store';
import { userState } from '../../../user/store';
import * as userActions from '../../store/actions';

@Component({
  selector: 'my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.css']
})
export class MyQuestionsComponent implements OnInit, OnDestroy {


  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
