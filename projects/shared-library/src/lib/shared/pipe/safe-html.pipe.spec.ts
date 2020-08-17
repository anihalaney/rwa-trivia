import { SafeHtmlPipe } from './safe-html.pipe';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { inject, TestBed } from '@angular/core/testing';

describe('SanitiseHtmlPipe', () => {
    beforeEach(() => {
        TestBed
            .configureTestingModule({
                imports: [
                    BrowserModule
                ]
            });
    });

    it('create an instance', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
        const pipe = new SafeHtmlPipe(domSanitizer);
        expect(pipe).toBeTruthy();
    }));

    it('It should return safe string ', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
        const pipe = new SafeHtmlPipe(domSanitizer);
        expect(pipe.transform(`<script>safeCode()</script>`))
            .toEqual({'changingThisBreaksApplicationSecurity': '<script>safeCode()</script>'});
    }));
});
