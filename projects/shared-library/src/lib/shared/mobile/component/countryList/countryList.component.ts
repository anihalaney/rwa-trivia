import { Component, Input, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { Country } from './model/country.model';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { UserActions, coreState, CoreState } from 'shared-library/core/store';


@Component({
  selector: 'country-list',
  templateUrl: 'countryList.component.html',
  styleUrls: ['countryList.component.css']
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class CountryListComponent implements OnInit, OnDestroy {

  country;
  responseJson;
  allCountries: Array<Country> = [];
  subscriptions: Subscription[] = [];
  searchCountries = '';

  constructor(private _modalDialogParams: ModalDialogParams, private cd: ChangeDetectorRef,
    private store: Store<CoreState>, private userAction: UserActions) {
  }

  ngOnInit() {
    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.countries)).subscribe(countries => {
      this.cd.markForCheck();
      if (countries) {
        if (countries.length > 0) {
          this.allCountries = countries.sort((prev, next) => prev.name.localeCompare(next.name));
        }
      }
    }));
    this.country = this._modalDialogParams.context.Country;

    this.store.dispatch(this.userAction.getCountries());

    this._modalDialogParams.context.closeObserver.subscribe((res) => {
      this.onClose();
    });
  }

  onItemTap(args) {
    this.responseJson = {
      dialCode: args.dialCode,
      name: args.name,
      flagClass: args.flagClass
    };
    this._modalDialogParams.closeCallback(this.responseJson);
    this.cd.markForCheck();
  }

  onClose() {
    this._modalDialogParams.closeCallback();
  }

  ngOnDestroy() {
  }
}
