import { Injectable, Inject } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable()
export class TestServiceService {

    constructor(private http: HttpClient) { }

    // Uses http.get() to load data from a single API endpoint
    getCountry() {
        console.log("in test 1 update");
        return this.http.get('https://restcountries.eu/rest/v2/name/aruba?fullText=true');
    }

}