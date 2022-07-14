import type { ServerErrorMessageType } from "@customTypes/admin/common"

interface IService {
   updatedAt: Date,
   description: string,
   name: string,
   id: string
}

export type AdminPageType = {
   data: IService,
   serverErrorMessage: ServerErrorMessageType
}