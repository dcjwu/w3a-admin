import { ServerErrorMessageType } from "@customTypes/admin/common/serverErrorMessage.type"

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