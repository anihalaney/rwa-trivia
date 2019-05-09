import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { CountryCode } from './country-code';
import { Country } from './model/country.model';

@Component({
  selector: 'country-list',
  templateUrl: 'countryList.component.html',
  styleUrls: ['countryList.component.css']
})

export class CountryListComponent implements OnInit {

  country;
  responseJson;
  allCountries: Array<Country> = [];
  constructor(private _modalDialogParams: ModalDialogParams, private countryCodeData: CountryCode, private cd: ChangeDetectorRef) {
    this.country = this._modalDialogParams.context.Country;
    this.allCountries = countryCodeData.allCountries;
  }

  ngOnInit() {
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
}
