import type { ServerErrorMessageType } from "@customTypes/admin/common"

interface IMessage {
   createdAt: Date,
   email: string,
   ipAddress: string,
   name: string,
   text: string,
   topic: string
}

export type MessagesPageType = {
   data: IMessage,
   serverErrorMessage: ServerErrorMessageType
}