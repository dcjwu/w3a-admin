import type { ServerErrorMessageType } from "@customTypes/admin/common"

interface IPartner {
   id: string,
   name: string,
   imageUrl: string,
   link: string,
   createdAt: Date
}

export type PartnersPageType = {
   data: IPartner[],
   serverErrorMessage: ServerErrorMessageType
}