import { Injectable, Inject, NgZone } from '@angular/core';
import { DbBaseService } from './dbbase.service';

@Injectable()
export class TnsDbService extends DbBaseService {

    constructor() {
        super();
    }

    public getData() {
        console.log('tns db service ed');
    }
}