import { ServerErrorMessageType } from "@customTypes/admin/common"

interface IUserData {
   id: string,
   email: string,
   imageUrl?: string,
   name: string,
   updatedAt: Date,
   createdAt: Date
}

export type UserPageType = {
   data: IUserData,
   serverErrorMessage: ServerErrorMessageType
}