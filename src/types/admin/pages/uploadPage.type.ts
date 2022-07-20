import type { ServerErrorMessageType } from "@customTypes/admin/common"

interface IOwner {
   id: string
}

interface IFiles {
   ChecksumAlgorithm: Array<string>,
   ETag: string,
   Key: string,
   LastModified: string,
   Size: number,
   StorageClass: string
   Owner: IOwner
}

export type UploadPageType = {
   data: IFiles[],
   serverErrorMessage: ServerErrorMessageType
}