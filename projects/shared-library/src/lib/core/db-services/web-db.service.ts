import { Injectable, Inject, NgZone } from '@angular/core';
import { DbBaseService } from './dbbase.service';

@Injectable()
export class WebDbService extends DbBaseService{

    constructor() {
        super();
    }

    public getData() {
        console.log('web Service');
    }
}