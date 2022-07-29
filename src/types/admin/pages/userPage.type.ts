import { ServerErrorMessageType } from "@customTypes/admin/common"

interface UserData {
   id: string,
   email: string,
   imageUrl?: string,
   name: string,
   updatedAt: Date,
   createdAt: Date
}

export type UserPageType = {
   data: UserData,
   serverErrorMessage: ServerErrorMessageType
}