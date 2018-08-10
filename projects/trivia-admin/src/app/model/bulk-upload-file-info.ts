import { Observable } from 'rxjs';

export class BulkUploadFileInfo {
    id: string;
    date: number;
    fileName: String;
    categoryId: number;
    category?: string;
    primaryTag: String;
    uploaded: number;
    approved: number;
    rejected: number;
    status: String;
    created_uid?: string;
    downloadUrl?: Observable<String>;
}
