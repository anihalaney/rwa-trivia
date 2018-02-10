import { Question } from './question';
import { BulkUploadFileInfo} from './bulk-upload-file-info'

export class BulkUpload {
  bulkUploadFileInfo: BulkUploadFileInfo;
  questions: Question[];
  file?: File;
}
