import { Injectable } from '@angular/core';
import Quill from 'quill';
import QuillAutoLink from './../../shared/quill-module/quillAutolink';


@Injectable()
export class QuillInitializeService {
    constructor() {
        console.log('qilljs called');
        Quill.register('modules/autoLink', QuillAutoLink, true);
    }

}
