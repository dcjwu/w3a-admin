import { ServerErrorMessageType } from "@customTypes/admin/common/serverErrorMessage.type"

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