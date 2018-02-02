import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {ActionWithPayload} from './action-with-payload';

import {FileTrack } from '../../../model';

@Injectable()
export class FileSummaryActions {

    
    
    static ADD_File_Track_Record = 'ADD_File_Track_Record';
    addFileRecord(fileTrack: FileTrack): ActionWithPayload<FileTrack> {
        console.log(fileTrack);
        return {
        type: FileSummaryActions.ADD_File_Track_Record,
        payload: fileTrack
        };
    }
    
    
}
