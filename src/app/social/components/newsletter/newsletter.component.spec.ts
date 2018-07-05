import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NewsletterComponent } from './newsletter.component';
import { Store } from '@ngrx/store';
import { StoreModule } from '@ngrx/store';
import { User, Subscription } from '../../../model';
import { AppState, appState } from '../../../store';
import * as socialActions from '../../../social/store/actions';

describe('Component: NewsletterComponent', () => {

    let component: NewsletterComponent;
    let fixture: ComponentFixture<NewsletterComponent>;
    let _store: any;
    let spy: any;

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

    it('submitting a form', () => {
        expect(component.subscriptionForm.valid).toBeFalsy();
        component.subscriptionForm.controls['email'].setValue('test@test.com');
        expect(component.subscriptionForm.valid).toBeTruthy();

        // dispatch service to save subscribe email

        const subscription = new Subscription();
        subscription.email = component.subscriptionForm.controls['email'].value;
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
});
