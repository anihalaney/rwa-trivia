import { Injectable } from '@angular/core';

function _location(): any {
    // return the global native browser window object
    return location;
}

@Injectable()
export class LocationRef {
    get nativeLocation(): any {
        return _location();
    }
}
