import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { EffectsTestingModule, EffectsRunner } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';
import { AngularFire } from 'angularfire2';

import { TagEffects } from './tag.effects';
import { TagActions } from '../actions';
import { TagService } from '../../services';

describe('Tag Effect', () => {
  let runner: EffectsRunner;
  let tagEffects: TagEffects;
  let tagService: TagService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      EffectsTestingModule
    ],
    providers: [
      TagEffects, TagActions, TagService,
      { "provide": AngularFire, "useValue": null }
    ]
  }));

  it('Call Load Tags Success action after Load Tags',
    inject([
      EffectsRunner, TagEffects, TagService
    ],
    (_runner, _tagEffects, _tagService) => {
      runner = _runner;
      tagEffects = _tagEffects;
      tagService = _tagService;

      spyOn(tagService, 'getTags')
          .and.returnValue(Observable.of(['C#']));

      runner.queue({ type: TagActions.LOAD_TAGS });

      tagEffects.loadTags$.subscribe(result => {
        expect(result.type).toEqual(TagActions.LOAD_TAGS_SUCCESS);
        expect(result.payload.length).toEqual(1);
        expect(result.payload[0]).toEqual('C#');
      });
    })
  );

});
