export interface BulkUploadFileInfo {
  file: File;
  categoryId: number;
  primaryTag: string;
  uploadedOn: Date;
  status: string;
  uploaded: number;
  approved: number;
  rejected: number;
}
