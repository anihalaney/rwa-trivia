import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {ActionWithPayload} from './action-with-payload';

import {FileTrack } from '../../../model';

@Injectable()
export class FileSummaryActions {

    
    
    // static ADD_File_Track_Record = 'ADD_File_Track_Record';
    // addFileRecord(fileTrack: FileTrack): ActionWithPayload<FileTrack> {
    //     return {
    //     type: FileSummaryActions.ADD_File_Track_Record,
    //     payload: fileTrack
    //     };
    // }


    static LOAD_FILE_RECORD = 'LOAD_FILE_RECORD';
    loadFileRecord(): ActionWithPayload<null> {
        return {
        type: FileSummaryActions.LOAD_FILE_RECORD,
        payload: null
        };
    }

    static LOAD_FILE_RECORD_SUCCESS = 'LOAD_FILE_RECORD_SUCCESS';
    loadFileRecordSuccess(fileTrack: FileTrack[]): ActionWithPayload<FileTrack[]> {
        return {
        type: FileSummaryActions.LOAD_FILE_RECORD_SUCCESS,
        payload: fileTrack
        };
    }

}
