import { FormDataType, ServerErrorMessageType } from "@customTypes/admin/common"

export enum TicketStatusEnum {
   NEW = "NEW",
   CLOSED = "CLOSED",
   REPLIED = "REPLIED"
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
   createdAt: Date,
   reply: null | FormDataType
}

export type TicketsPageType = {
   data: ITicketsData[],
   serverErrorMessage: ServerErrorMessageType
}

export type TicketsByIdPageType = {
   data: ITicketsData,
   serverErrorMessage: ServerErrorMessageType
}