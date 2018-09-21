import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';



@Injectable()
export class UpdateService {


    constructor(public updates: SwUpdate) {
        // If updates are enabled
        // if (updates.isEnabled) {
        //     // poll the service worker to check for updates
        //   //  console.log('check update');
        //     interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate());
        // }
    }

    // Called from app.components.ts constructor
    public checkForUpdates() {
        console.log('checkForUpdates');
        if (this.updates.isEnabled) {
            this.updates.available.subscribe(event => {
                console.log('current version is', event.current);
                console.log('available version is', event.available);
                this.promptUser(event);
            });
            this.updates.activated.subscribe(event => {
                console.log('old version was', event.previous);
                console.log('new version is', event.current);
            });
        }
    }

    // If there is an update, promt the user
    private promptUser(e): void {
        if (e.available) {
            console.log('promptUser');
        }
    }
}
