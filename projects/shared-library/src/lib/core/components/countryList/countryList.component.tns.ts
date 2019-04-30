import { Component, Input, OnInit, ChangeDetectorRef } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { CountryCode } from "./country-code";
import { Country } from "./model/country.model";

@Component({
  selector: "country-list",
  templateUrl: "countryList.component.html",
  styleUrls: ["countryList.component.css"]
})

export class CountryListComponent implements OnInit {

  searchCountries;
  country;
  countries = new Array();
  responseJson;
  allCountries: Array<Country> = [];
  constructor(private _modalDialogParams: ModalDialogParams, private countryCodeData: CountryCode, private cd: ChangeDetectorRef) {
    this.country = this._modalDialogParams.context.Country;
  }

  ngOnInit() {
    this.fetchCountryData();
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

  protected fetchCountryData(): void {
    this.countryCodeData.allCountries.forEach((c) => {
      const country = new Country();
      country.name = c[0].toString();
      country.iso2 = c[1].toString();
      country.dialCode = c[2].toString();
      country.priority = +c[3] || 0;
      country.areaCode = +c[4] || null;
      country.flagClass = country.iso2.toLocaleLowerCase();
      this.allCountries.push(country);
    });
  }
}
