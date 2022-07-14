import type { ServerErrorMessageType } from "@customTypes/admin/common"

interface ITicket {
   createdAt: Date,
   email: string,
   ipAddress: string,
   name: string,
   text: string,
   topic: string
}

export type TicketsPageType = {
   data: ITicket,
   serverErrorMessage: ServerErrorMessageType
}