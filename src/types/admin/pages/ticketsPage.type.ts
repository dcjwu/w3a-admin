import { ServerErrorMessageType } from "@customTypes/admin/common"

export enum TicketStatusEnum {
   ACTIVE = "ACTIVE",
   CLOSED = "CLOSED"
}

interface ITicketsData {
   id: string,
   email: string,
   ipAddress: string,
   name: string,
   status: TicketStatusEnum,
   text: string,
   topic: string,
   companyName: string,
   createdAt: Date
}

export type TicketsPageType = {
   data: ITicketsData[],
   serverErrorMessage: ServerErrorMessageType
}

export type TicketsByIdPageType = {
   data: ITicketsData,
   serverErrorMessage: ServerErrorMessageType
}