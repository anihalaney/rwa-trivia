import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { EffectsTestingModule, EffectsRunner } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';
import { AngularFire } from 'angularfire2';

import { TEST_DATA } from '../../../testing/test.data';
import { CategoryEffects } from './category.effects';
import { CategoryActions } from '../actions';
import { CategoryService } from '../../services';

describe('Effects: CategoryEffects', () => {
  let _runner: EffectsRunner;
  let _effects: CategoryEffects;
  let _service: CategoryService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      EffectsTestingModule
    ],
    providers: [
      CategoryEffects, CategoryActions, CategoryService,
      { "provide": AngularFire, "useValue": {} }
    ]
  }));

  it('Call Load Tags Success action after Load Tags', 
    inject([
      EffectsRunner, CategoryEffects, CategoryService
    ],
    (runner: EffectsRunner, catEffects: CategoryEffects, catService: CategoryService) => {
      _runner = runner;
      _effects = catEffects;
      _service = catService;

      spyOn(_service, 'getCategories')
          .and.returnValue(Observable.of(TEST_DATA.categories));

      _runner.queue({ type: CategoryActions.LOAD_CATEGORIES });

      _effects.loadCategories$.subscribe(result => {
        expect(result.type).toEqual(CategoryActions.LOAD_CATEGORIES_SUCCESS);
        expect(result.payload).toEqual(TEST_DATA.categories);
      });
    })
  );

});
