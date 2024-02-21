import { BatchItem } from '@rpldy/uploady'

export interface UploadIdItem {
  fileName: string
  uploadId: string
}

export interface FileItem extends BatchItem {
  totalTime?: string
  speed?: number
}
