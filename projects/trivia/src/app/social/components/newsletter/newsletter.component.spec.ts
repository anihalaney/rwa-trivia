import { TestBed, ComponentFixture, async, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NewsletterComponent } from './newsletter.component';
import { StoreModule, Store } from '@ngrx/store';
import { User, Subscription } from '../../../../../../shared-library/src/lib/shared/model';
import { TEST_DATA } from '../../../testing/test.data';
import { subscribeOn } from 'rxjs/internal/operators/subscribeOn';

describe('Component: NewsletterComponent', async () => {

    let component: NewsletterComponent;
    let fixture: ComponentFixture<NewsletterComponent>;
    let _store: any;
    let spy: any;
    let user: User;

    beforeEach(() => {

        // refine the test module by declaring the NewsletterComponent component
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FormsModule, StoreModule.forRoot({})],
            providers: [Store],
            declarations: [NewsletterComponent]
        });

        // create component and NewsletterComponent fixture
        fixture = TestBed.createComponent(NewsletterComponent);

        // get NewsletterComponent component from the fixture
        component = fixture.componentInstance;
        component.user = user;

        // get the injected instances
        _store = fixture.debugElement.injector.get(Store);

        // get object of action
        spy = spyOn(_store, 'dispatch');

        // dispatch service to get TotalSubscriber count
        spy.and.callFake((action: any) => {
            expect(action.GetTotalSubscriber);
        });

        component.ngOnInit();

        expect(_store.dispatch).toHaveBeenCalled();

    });

    it('form invalid when empty', () => {
        expect(component.subscriptionForm.valid).toBeFalsy();
    });

    it('email field validity', () => {
        let errors = {};
        const email = component.subscriptionForm.controls['email'];

        // Email field is required
        errors = email.errors || {};
        expect(errors['required']).toBeTruthy();

        // Set incorrect value to email
        email.setValue('test');
        errors = email.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeTruthy();

        // Set correct value to email
        email.setValue('demo@example.com');
        errors = email.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
    });

    it('subscription for normal user', () => {
        expect(component.subscriptionForm.valid).toBeFalsy();
        component.subscriptionForm.controls['email'].setValue('test@test.com');
        expect(component.subscriptionForm.valid).toBeTruthy();

        // dispatch service to save subscribe email

        const subscription = new Subscription();
        subscription.email = component.subscriptionForm.controls['email'].value;
        if (user) {
            subscription.userId = user.userId;
        }
        spy.and.callFake((action: any) => {
            expect(action.AddSubscriber);
            expect(action.payload.subscription).toEqual(subscription);
        });

        // Trigger the subscribe function
        component.onSubscribe();

        expect(_store.dispatch).toHaveBeenCalled();

        // Now we can check to make sure the emitted value is correct
        expect(component.subscriptionForm.get('email').value).toBe('test@test.com');
    });

    it('subscription for logged in user', () => {
        expect(component.subscriptionForm.valid).toBeFalsy();
        user = { ...TEST_DATA.userList[0] };
        component.user = user;
        component.subscriptionForm.controls['email'].setValue(user.email);
        expect(component.subscriptionForm.valid).toBeTruthy();

        // dispatch service to save subscribe email

        const subscription = new Subscription();
        subscription.email = user.email;
        if (user) {
            subscription.userId = user.userId;
        }

        spy.and.callFake((action: any) => {
            expect(action.AddSubscriber);
            expect(action.payload.subscription).toEqual(subscription);
        });

        // Trigger the subscribe function
        component.onSubscribe();

        expect(_store.dispatch).toHaveBeenCalled();

        // Now we can check to make sure the emitted value is correct
        console.log("expected" + JSON.stringify(user));
        expect(component.subscriptionForm.get('email').value).toBe(user.email);
        expect(component.user.userId).toBe(user.userId);
    });
});
