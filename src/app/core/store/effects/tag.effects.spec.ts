import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { EffectsTestingModule, EffectsRunner } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';
import { AngularFire } from 'angularfire2';

import { TEST_DATA } from '../../../testing/test.data';
import { TagEffects } from './tag.effects';
import { TagActions } from '../actions';
import { TagService } from '../../services';

describe('Effects: TagEffects', () => {
  let _runner: EffectsRunner;
  let _effects: TagEffects;
  let _service: TagService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      EffectsTestingModule
    ],
    providers: [
      TagEffects, TagActions, TagService,
      { "provide": AngularFire, "useValue": {} }
    ]
  }));

  it('Call Load Tags Success action after Load Tags', 
    inject([
      EffectsRunner, TagEffects, TagService
    ],
    (runner: EffectsRunner, tagEffects: TagEffects, tagService: TagService) => {
      _runner = runner;
      _effects = tagEffects;
      _service = tagService;

      spyOn(_service, 'getTags')
          .and.returnValue(Observable.of(TEST_DATA.tagList));

      _runner.queue({ type: TagActions.LOAD_TAGS });

      _effects.loadTags$.subscribe(result => {
        expect(result.type).toEqual(TagActions.LOAD_TAGS_SUCCESS);
        expect(result.payload).toEqual(TEST_DATA.tagList);
      });
    })
  );

});
