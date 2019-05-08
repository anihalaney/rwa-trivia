import { Injectable } from '@angular/core';
import Quill from 'quill';
import QuillAutoLink from './../../shared/quill-module/quillAutolink';
import { coreState, CoreState } from './../../core/store/reducers';
import { Store, select } from '@ngrx/store';
import { FormulaBlot } from './../../shared/quill-module/formula';
import Formula from './../../shared/quill-module/formula';
@Injectable()
export class QuillInitializeService {
    appSettings;
    constructor(public store: Store<CoreState>) {
        this.store.select(coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
            console.log('app settings  ss', appSettings);
            this.appSettings = appSettings;
        });
        Quill.register('modules/autoLink', QuillAutoLink, true);
         Quill.register('modules/formula', Formula, true);
    }

}
