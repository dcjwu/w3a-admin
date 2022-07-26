import type { ServerErrorMessageType } from "@customTypes/admin/common"

interface IProject {
   id: string
   name: string,
   description: string,
   imageUrl: string,
   keywords: string[],
   updatedAt: Date,
   createdAt: Date,
}

export type ProjectsPageType = {
   data: IProject[],
   serverErrorMessage: ServerErrorMessageType
}