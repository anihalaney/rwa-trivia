import { TestBed } from '@angular/core/testing';
import { SearchCountryFilterPipe } from './search-country-filter.pipe';
import { testData } from 'test/data';

describe('SearchCountryFilter', () => {

    it('create an instance', () => {
        const pipe = new SearchCountryFilterPipe();
        expect(pipe).toBeTruthy();
    });

    it('pipe should return the list of countries which matched country name', () => {
        const countries = testData.countries;
        const pipe = new SearchCountryFilterPipe();
        expect(pipe.transform(countries, 'Ec'))
            .toEqual([countries[2]]);
    });

    it('pipe should return the blank array name is not matched to any country name', () => {
        const countries = testData.countries;
        const pipe = new SearchCountryFilterPipe();
        expect(pipe.transform(countries, 'test'))
            .toEqual([]);
    });

});
