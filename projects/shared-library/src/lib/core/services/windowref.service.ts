import { Injectable } from '@angular/core';
import { AnalyticsEventConstants } from 'shared-library/shared/model';
import { CONFIG } from '../../environments/environment';

function _window(): any {
    // return the global native browser window object
    return window;
}
declare var gtag;

@Injectable()
export class WindowRef {

    analyticsParameters: { [key: string]: string };

    get nativeWindow(): any {
        return _window();
    }

    constructor() {
        this.analyticsParameters = {};
    }

    addNavigationsInAnalytics(evt: any) {
        if (this.nativeWindow.ga) {
            gtag('config', CONFIG.ua_id, { 'page_path': evt.urlAfterRedirects });
            //  gtag('config', 'UA-122966274-1', { 'page_path': evt.urlAfterRedirects });
        }
    }

    scrollDown() {
        if (this.nativeWindow.scrollTo) {
            this.nativeWindow.scrollTo(0, 0);
        }
    }

    isDataLayerAvailable() {
        return (this.nativeWindow && this.nativeWindow.dataLayer) ? true : false;
    }

    addAnalyticsParameters(name: string, value: string) {
        this.analyticsParameters[name] = value;
    }

    pushAnalyticsEvents(event: string) {
        this.analyticsParameters[AnalyticsEventConstants.EVENT] = event;
        this.nativeWindow.dataLayer.push(this.analyticsParameters);
    }

    getNavigatorGeolocation() {
        return navigator.geolocation;
    }
}
