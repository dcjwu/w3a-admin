import type { ServerErrorMessageType } from "@customTypes/admin/common"

interface IService {
   updatedAt: Date,
   createdAt: Date,
   description: string,
   name: string,
   id: string
}

export type AdminPageType = {
   data: IService,
   serverErrorMessage: ServerErrorMessageType
}