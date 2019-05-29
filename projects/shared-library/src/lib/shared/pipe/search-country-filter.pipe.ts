import { Pipe, PipeTransform } from '@angular/core';
import { Country } from 'shared-library/shared/mobile/component/countryList/model/country.model';

@Pipe({
    name: 'searchCountry'
})
export class SearchCountryFilterPipe implements PipeTransform {

    transform(value: Array<Country>, args: string): any {
        if (args == null || args === 'all' || args === '') {
            return value;
        }

        if (value) {
            args = args.replace('+', '');
            return value.filter((val: Country) => {
               return  val.name.toUpperCase().search(args.toUpperCase()) >= 0 || val.dialCode.toUpperCase().search(args.toUpperCase()) >= 0;
            });
        } else {
            return;
        }
    }
}
