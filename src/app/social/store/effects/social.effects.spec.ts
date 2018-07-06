import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
// import { AngularFire } from 'angularfire2';

import { TEST_DATA } from '../../../testing/test.data';
import { SocialEffects } from './social.effects';
import { SocialActions } from '../actions';
import { SocialService } from '../../../core/services/social.service';

describe('Effects: SocialEffects', () => {
    let effects: SocialEffects;
    let actions: Observable<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                // any modules needed
            ],
            providers: [
                SocialEffects,
                provideMockActions(() => actions),
                // other providers
            ],
        });

        effects = TestBed.get(SocialEffects);
    });

});

